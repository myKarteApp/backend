import { AdminDatasourceProvider } from '@/datasource';
import { DomainAuthDefaultProvider } from '@/domain/account/auth';
import { DomainClientGetListProvider } from '@/domain/account/roles/client/DomainClientGetList.provider';
import { HttpCookieService } from '@/domain/http';
import { AccountInfoDto, ResponseBody } from '@/shared';
import { NotFound } from '@/utils/error';
import { ErrorCode } from '@/utils/errorCode';
import { Controller, Get, Param, Req, Res } from '@nestjs/common';
import { AuthInfo, PrismaClient } from '@prisma/client';
import {
  Request as ExpressRequest,
  Response as ExpressResponse,
} from 'express';

@Controller('/admin/:authId')
export class AdminClientController {
  constructor(
    private readonly datasource: AdminDatasourceProvider,
    private readonly cookieService: HttpCookieService,
    private readonly domainAuthDefaultProvider: DomainAuthDefaultProvider,
    private readonly domainClientGetListProvider: DomainClientGetListProvider,
  ) {}

  @Get('account')
  async readList(
    @Param('authId') authId: string,
    @Req() request: ExpressRequest,
    @Res() response: ExpressResponse,
  ) {
    const sessionId = request.cookies[this.cookieService.loginSessionKey];
    if (!sessionId) throw NotFound(ErrorCode.Error12);

    const accountInfoList: AccountInfoDto[] = await this.datasource.transact(
      async (connect: PrismaClient) => {
        // ログイン状態を確認する
        await this.cookieService.validateLoginSession(
          authId,
          sessionId,
          connect,
        );

        // ロールを取得する
        const authInfo: AuthInfo | null =
          await this.domainAuthDefaultProvider.findById(
            authId,
            undefined,
            undefined,
            connect,
          );
        if (!authInfo) throw NotFound(ErrorCode.Error19);

        // アカウント情報を全て取得する
        return this.domainClientGetListProvider.getAllListByAdmin(authInfo);
      },
    );

    const responseBody: ResponseBody<'getClientInfoListByAdmin'> = {
      message: 'OK',
      data: {
        accountInfoList: accountInfoList,
      },
    };
    response.status(200).json(responseBody);
  }
}
