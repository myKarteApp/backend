import { AdminDatasourceProvider } from '@/datasource';
import { DomainAuthDefaultProvider } from '@/domain/account/auth';
import { DomainClientGetDetailProvider } from '@/domain/account/roles/client/DomainClientGetDetail.provider';
import { DomainClientGetListProvider } from '@/domain/account/roles/client/DomainClientUpdate.provider';
import { HttpCookieService } from '@/domain/http';
import { ClientInfoDto, ResponseBody } from '@/shared';
import { NotFound } from '@/utils/error';
import { ErrorCode } from '@/utils/errorCode';
import { Controller, Get, Param, Req, Res } from '@nestjs/common';
import { AuthInfo, PrismaClient } from '@prisma/client';
import {
  Request as ExpressRequest,
  Response as ExpressResponse,
} from 'express';

@Controller('/admin/:authId/client')
export class AdminClientController {
  constructor(
    private readonly datasource: AdminDatasourceProvider,
    private readonly cookieService: HttpCookieService,
    private readonly domainAuthDefaultProvider: DomainAuthDefaultProvider,
    private readonly domainClientGetListProvider: DomainClientGetListProvider,
    private readonly domainClientGetDetailProvider: DomainClientGetDetailProvider,
  ) {}

  @Get('')
  async getClientInfoListByAdmin(
    @Param('authId') authId: string,
    @Req() request: ExpressRequest,
    @Res() response: ExpressResponse,
  ) {
    const sessionId = request.cookies[this.cookieService.loginSessionKey];
    if (!sessionId) throw NotFound(ErrorCode.Error12);

    const clientInfoList: ClientInfoDto[] = await this.datasource.transact(
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
        clientInfoList: clientInfoList,
      },
    };
    response.status(200).json(responseBody);
  }

  @Get(':clientId')
  async getClientInfoDetailByAdmin(
    @Param('authId') authId: string,
    @Param('clientId') clientId: string,
    @Req() request: ExpressRequest,
    @Res() response: ExpressResponse,
  ) {
    const sessionId = request.cookies[this.cookieService.loginSessionKey];
    if (!sessionId) throw NotFound(ErrorCode.Error12);

    const clientInfo: ClientInfoDto | null = await this.datasource.transact(
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
        return this.domainClientGetDetailProvider.getDetailByAdmin(
          authInfo,
          clientId,
          connect,
        );
      },
    );

    if (!clientInfo) throw NotFound(ErrorCode.Error23);

    const responseBody: ResponseBody<'getClientInfoDetailByAdmin'> = {
      message: 'OK',
      data: {
        clientInfo: clientInfo,
      },
    };
    response.status(200).json(responseBody);
  }
}
