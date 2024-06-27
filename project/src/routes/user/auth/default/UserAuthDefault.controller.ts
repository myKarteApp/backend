import { DefaultAuthDto } from '@/shared/dto';
import { Body, Controller, Get, Param, Post, Req, Res } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { NotFound } from '@/utils/error';
import { v4 } from 'uuid';
import {
  Request as ExpressRequest,
  Response as ExpressResponse,
} from 'express';

import { ResponseBody } from '@/shared';
import { HttpSessionService } from '@/domain/http';
import { MainDatasourceProvider } from '@/datasource';
import { UserAuthDefaultService } from './UserAuthDefault.service';

@Controller('/user/auth/default')
export class UserAuthDefaultController {
  constructor(
    private readonly authService: UserAuthDefaultService,
    private readonly datasource: MainDatasourceProvider,
    private readonly sessionService: HttpSessionService,
  ) {}

  @Post('create')
  async create(@Body() dto: DefaultAuthDto, @Res() response: ExpressResponse) {
    const newAuthId = v4();
    await this.datasource.transact(async (connect: PrismaClient) => {
      await this.authService.createAuthInfo(dto, newAuthId, connect);
    });

    const responseBody: ResponseBody<'createUserAuthDefault'> = {
      message: 'OK',
      data: {
        authId: newAuthId,
      },
    };
    response.status(200).json(responseBody);
  }

  @Get(':authId')
  async read(
    @Param('authId') authId: string,
    @Req() request: ExpressRequest,
    @Res() response: ExpressResponse,
  ) {
    if (!process.env.AUTH_LOGIN_SESSION_KEY) throw NotFound('Error10');
    const sessionId = request.cookies[process.env.AUTH_LOGIN_SESSION_KEY];
    await this.sessionService.validateLoginSession(authId, sessionId);

    const authInfo = await this.authService.findById(authId);
    if (!authInfo) throw NotFound('Error5');

    const responseBody: ResponseBody<'getUserAuthDefault'> = {
      message: 'OK',
      data: {
        authId: authInfo.authId,
        email: authInfo.email,
        authType: authInfo.authType,
        authRole: authInfo.authRole,
      },
    };
    response.status(200).json(responseBody);
  }

  /*
    ログイン機能
    NOTE: 分けるべき？→google auth認証を実装してから考える
  */
  @Post('login')
  async login(@Body() dto: DefaultAuthDto, @Res() response: ExpressResponse) {
    let authId = '';
    await this.datasource.transact(async (connect: PrismaClient) => {
      const authInfo = await this.authService.findByEmail(dto, connect);
      console.log(authInfo);
      if (!authInfo) throw NotFound('Error6');
      const jwsToken =
        await this.sessionService.jwsTokenProvider.createJwsToken(authInfo);
      await this.sessionService.setAuthSessionId(response, jwsToken, connect);
      authId = authInfo.authId;
    });

    const responseBody: ResponseBody<'loginUserAuthDefault'> = {
      message: 'OK',
      data: {
        authId: authId,
      },
    };
    response.status(200).json(responseBody);
  }

  /**
    TODO: 調査
    ログイン→ログアウト→ログインでエラー発生する
    PrismaClientKnownRequestError: 
    Invalid `this.connect(_connect).loginSession.update()` invocation in
    /usr/app/project/src/domain/http/HttpSession.service.ts:46:47

      43   sessionId: string,
      44   _connect?: PrismaClient,
      45 ) {
    → 46   await this.connect(_connect).loginSession.update(
    Transaction API error: Transaction already closed: Could not perform operation.
        at _n.handleRequestError (/usr/app/project/node_modules/@prisma/client/runtime/library.js:122:6927)
        at _n.handleAndLogRequestError (/usr/app/project/node_modules/@prisma/client/runtime/library.js:122:6235)
        at _n.request (/usr/app/project/node_modules/@prisma/client/runtime/library.js:122:5919)
        at l (/usr/app/project/node_modules/@prisma/client/runtime/library.js:131:9116)
        at HttpSessionService.clearAuthSessionId (/usr/app/project/src/domain/http/HttpSession.service.ts:46:5)
   */
  @Post(':authId/logout')
  async logout(
    @Req() request: ExpressRequest,
    @Res() response: ExpressResponse,
  ) {
    await this.datasource.transact(async (connect: PrismaClient) => {
      if (!process.env.AUTH_LOGIN_SESSION_KEY) throw NotFound('Error7');
      const sessionId = request.cookies[process.env.AUTH_LOGIN_SESSION_KEY];
      this.sessionService.clearAuthSessionId(response, sessionId, connect);
    });

    const responseBody: ResponseBody<'logoutUserAuthDefault'> = {
      message: 'OK',
    };
    response.status(200).json(responseBody);
  }
}
