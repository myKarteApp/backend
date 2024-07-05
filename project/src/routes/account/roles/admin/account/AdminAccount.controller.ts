import {
  AccountInfo,
  AccountInfoDto,
  AuthRole,
  CreateAccountInfoDto,
  ResponseBody,
  UserIdListDto,
} from '@/shared';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  Res,
} from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';

import {
  Request as ExpressRequest,
  Response as ExpressResponse,
} from 'express';
import { _CreateAccountInfoDto, _PutAccountInfoDto } from './swaggerDto';
import { DomainAuthDefaultProvider } from '@/domain/account/auth/default/DomainAuthDefault.provider';
import { AdminDatasourceProvider } from '@/datasource';
import { AuthCookieProvider } from '@/domain/http';
import { DomainClientGetListProvider } from '@/domain/account/roles/client/DomainClientGetList.provider';
import { BadRequest, NotFound } from '@/utils/error';
import { ErrorCode } from '@/utils/errorCode';
import { AuthInfo, PrismaClient } from '@prisma/client';
import { AdminAccountService } from './AdminAccount.service';
import { DomainAccountProvider } from '@/domain/account/DomainAccount.provider';
import { DomainAccountGetListProvider } from '@/domain/account/DomainAccountGetList.provider';

@ApiTags('AdminAccount')
@Controller('/admin/:userId/account')
export class AdminAccountController {
  constructor(
    private readonly adminAccountService: AdminAccountService,
    private readonly datasource: AdminDatasourceProvider,
    // private readonly authCookieProvider: AuthCookieProvider,
    // private readonly domainAuthDefaultProvider: DomainAuthDefaultProvider,
    // private readonly domainClientGetListProvider: DomainClientGetListProvider,
    // private readonly domainAccountProvider: DomainAccountProvider,
    // private readonly domainClientGetDetailProvider: DomainClientGetDetailProvider,
  ) {}

  @Get('')
  public async getAccountList(
    @Req() request: ExpressRequest,
    @Res() response: ExpressResponse,
    @Param('userId') userId: string,
  ) {
    const accountInfoList: AccountInfo[] = await this.datasource.transact(
      async (connect: PrismaClient) => {
        // ログイン済みを確認する
        const myAccount: AccountInfo =
          await this.adminAccountService.getAccountInfoByUserId(
            request,
            userId,
            connect,
          );
        // アカウント情報を全て取得する
        return this.adminAccountService.getAllList(
          myAccount.authId,
          myAccount.authRole,
          connect,
        );
      },
    );

    const responseBody = {
      message: 'OK',
      data: {
        accountInfoList: accountInfoList,
      },
    };
    response.status(200).json(responseBody);
  }

  @Get(':targetUserId')
  public async getAccountDetailByUserId(
    @Req() request: ExpressRequest,
    @Res() response: ExpressResponse,
    @Param('userId') userId: string,
    @Param('targetUserId') targetUserId: string,
  ) {
    const accountInfo: AccountInfo = await this.datasource.transact(
      async (connect: PrismaClient) => {
        // ログイン済みを確認する
        const myAccount: AccountInfo =
          await this.adminAccountService.getAccountInfoByUserId(
            request,
            userId,
            connect,
          );

        // アカウント情報を全て取得する
        return this.adminAccountService.getDetail(
          myAccount.authId,
          myAccount.authRole,
          targetUserId,
          connect,
        );
      },
    );
    const responseBody = {
      message: 'OK',
      data: {
        accountInfo: accountInfo,
      },
    };
    response.status(200).json(responseBody);
  }

  @ApiBody({ type: _CreateAccountInfoDto })
  @Post('create')
  public async createAccountDetailByUserId(
    @Req() request: ExpressRequest,
    @Res() response: ExpressResponse,
    @Param('userId') userId: string,
    @Body() dto: CreateAccountInfoDto,
    @Query('sendEmail') sendEmail?: boolean | false,
  ) {
    await this.datasource.transact(async (connect: PrismaClient) => {
      // ログイン済みを確認する
      await this.adminAccountService.getAccountInfoByUserId(
        request,
        userId,
        connect,
      );

      await this.adminAccountService.create(dto, connect);
      if (sendEmail) {
        // TODO: メールを送信する
      }
    });

    const responseBody = {
      message: 'OK',
    };
    response.status(200).json(responseBody);
  }

  @ApiBody({ type: _PutAccountInfoDto })
  @Put(':targetUserId/update')
  public async updateAccountDetailByUserId(
    @Body() dto: Partial<CreateAccountInfoDto>,
    @Req() request: ExpressRequest,
    @Res() response: ExpressResponse,
    @Param('userId') userId: string,
    @Param('targetUserId') targetUserId: string,
  ) {}

  @Delete(':targetUserId/delete')
  public async deleteAccountDetailByUserId(
    @Req() request: ExpressRequest,
    @Res() response: ExpressResponse,
    @Param('userId') userId: string,
    @Param('targetUserId') targetUserId: string,
  ) {}

  @Post('bulkDelete')
  public async bulkDeleteAccountDetailByUserId(
    @Req() request: ExpressRequest,
    @Res() response: ExpressResponse,
    @Body() dto: UserIdListDto,
  ) {}
}
