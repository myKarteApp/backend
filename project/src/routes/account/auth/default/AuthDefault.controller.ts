import { DefaultAuthDto } from '@/shared/dto';
import { Body, Controller, Post, Req, Res } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { NotFound } from '@/utils/error';
import { v4 } from 'uuid';
import {
  Request as ExpressRequest,
  Response as ExpressResponse,
} from 'express';

import { ResponseBody } from '@/shared';
import { HttpCookieService } from '@/domain/http';
import { MainDatasourceProvider } from '@/datasource';

import { ErrorCode } from '@/utils/errorCode';
import { SpecLoginController } from '@/spec/SpecLogin.Controller';
import { AuthDefaultService } from './AuthDefault.service';

@Controller('/account/auth/default')
export class AuthDefaultController implements SpecLoginController {
  constructor(
    private readonly authService: AuthDefaultService,
    private readonly datasource: MainDatasourceProvider,
    private readonly cookieService: HttpCookieService,
  ) {}

  @Post('create')
  async create(@Body() dto: DefaultAuthDto, @Res() response: ExpressResponse) {
    const newAuthId = v4();
    await this.datasource.transact(async (connect: PrismaClient) => {
      await this.authService.createAuthInfo(dto, newAuthId, connect);
    });

    const responseBody: ResponseBody<'createAuthDefault'> = {
      message: 'OK',
      data: {
        authId: newAuthId,
      },
    };
    response.status(200).json(responseBody);
  }

  // @Get(':authId')
  // async read(
  //   @Param('authId') authId: string,
  //   @Req() request: ExpressRequest,
  //   @Res() response: ExpressResponse,
  // ) {
  //   const sessionId = request.cookies[this.cookieService.loginSessionKey];
  //   if (!sessionId) throw NotFound(ErrorCode.Error12);

  //   const authInfo = await this.datasource.transact(
  //     async (connect: PrismaClient) => {
  //       await this.cookieService.validateLoginSession(
  //         authId,
  //         sessionId,
  //         connect,
  //       );
  //       return this.authService.findById(authId, connect);
  //     },
  //   );
  //   await this.cookieService.validateLoginSession(authId, sessionId);

  //   if (!authInfo) throw NotFound(ErrorCode.Error13);

  //   const responseBody: ResponseBody<'getUserAuthDefault'> = {
  //     message: 'OK',
  //     data: {
  //       authId: authInfo.authId,
  //       email: authInfo.email,
  //       authType: authInfo.authType,
  //       authRole: authInfo.authRole,
  //     },
  //   };
  //   response.status(200).json(responseBody);
  // }

  @Post('login')
  async login(
    @Body() dto: DefaultAuthDto,
    @Res() response: ExpressResponse,
  ): Promise<void> {
    const authId = await this.datasource.transact(
      async (connect: PrismaClient) => {
        const authInfo = await this.authService.findByEmail(dto, connect);
        if (!authInfo) throw NotFound(ErrorCode.Error19);
        const jwsToken =
          await this.cookieService.jwsTokenProvider.createJwsToken(authInfo);
        await this.cookieService.setAuthSessionId(response, jwsToken, connect);
        return authInfo.authId;
      },
    );

    const responseBody: ResponseBody<'loginAuthDefault'> = {
      message: 'OK',
      data: {
        authId: authId,
      },
    };
    response.status(200).json(responseBody);
  }

  @Post('logout')
  async logout(
    @Req() request: ExpressRequest,
    @Res() response: ExpressResponse,
  ): Promise<void> {
    await this.datasource.transact(async (connect: PrismaClient) => {
      const sessionId = request.cookies[this.cookieService.loginSessionKey];
      if (!sessionId) return;
      await this.cookieService.clearAuthSessionId(response, sessionId, connect);
    });

    const responseBody: ResponseBody<'logoutAuthDefault'> = {
      message: 'OK',
    };
    response.status(200).json(responseBody);
  }
}
