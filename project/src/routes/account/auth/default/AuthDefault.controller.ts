import { DefaultAuthDto } from '@/shared/dto';
import { Body, Controller, Post, Req, Res } from '@nestjs/common';
import { AuthVerifyOneTimePass, PrismaClient } from '@prisma/client';
import { NotFound, Unexpected } from '@/utils/error';
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
import { MailService } from '@/domain/mail/mail.service';
import { ApiTags, ApiBody } from '@nestjs/swagger';
import { _DefaultAuthDto } from './swaggerDto';

@ApiTags('AuthDefault')
@Controller('/account/auth/default')
export class AuthDefaultController implements SpecLoginController {
  constructor(
    private readonly authService: AuthDefaultService,
    private readonly datasource: MainDatasourceProvider,
    private readonly cookieService: HttpCookieService,
    private readonly mailService: MailService,
  ) {}

  @ApiBody({ type: _DefaultAuthDto })
  @Post('create')
  async create(@Body() dto: DefaultAuthDto, @Res() response: ExpressResponse) {
    const newAuthId = v4();
    await this.datasource.transact(async (connect: PrismaClient) => {
      // 認証情報を作成する
      await this.authService.createAuthInfo(dto, newAuthId, connect);

      // OTPを保存する
      const authVerifyOneTimePassId = await this.authService.createOneTimePass(
        newAuthId,
        connect,
      );
      const authVerifyOneTimePass: AuthVerifyOneTimePass | null =
        await this.authService.findOneTimePassById(
          authVerifyOneTimePassId,
          connect,
        );
      if (!authVerifyOneTimePass) throw Unexpected(ErrorCode.Error27);

      // 本人確認用のメールを送信する
      await this.mailService.sendTemporaryRegistration(
        dto.email,
        authVerifyOneTimePass.passCode,
        authVerifyOneTimePass.queryToken,
      );
    });

    const responseBody: ResponseBody<'createAuthDefault'> = {
      message: 'OK',
      data: {
        authId: newAuthId,
      },
    };
    response.status(200).json(responseBody);
  }

  @ApiBody({ type: _DefaultAuthDto })
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
