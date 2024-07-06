import { AccountInfoOfDB, CreateAccountInfoDto, UserIdListDto } from '@/shared';
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
import {
  _BulkDeleteAccountInfoDto,
  _CreateAccountInfoDto,
  _UpdateAccountInfoDto,
} from './swaggerDto';
import { AdminDatasourceProvider } from '@/datasource';
import { BadRequest, MyError, Unexpected } from '@/utils/error';
import { ErrorCode } from '@/utils/errorCode';
import { PrismaClient } from '@prisma/client';
import { AdminAccountService } from './AdminAccount.service';
import { RequestBody, ResponseBody } from '@/shared/apiSchema/paths';

@ApiTags('AdminAccount')
@Controller('/admin/:userId/account')
export class AdminAccountController {
  constructor(
    private readonly adminAccountService: AdminAccountService,
    private readonly datasource: AdminDatasourceProvider,
  ) {}

  @ApiBody({ type: _CreateAccountInfoDto })
  @Post('create')
  public async createAccountByAdmin(
    @Req() request: ExpressRequest,
    @Res() response: ExpressResponse,
    @Body() dto: RequestBody<'createAccountByAdmin'>,
    @Param('userId') userId: string,
    @Query('sendEmail') sendEmail?: boolean | false,
  ) {
    await this.datasource.transact(async (connect: PrismaClient) => {
      // ログイン済みを確認する
      await this.adminAccountService.validateAuth(request, userId, connect);

      await this.adminAccountService.create(dto, connect);
      if (sendEmail) {
        // TODO: メールを送信する
      }
    });

    const responseBody: ResponseBody<'createAccountByAdmin'> = {
      message: 'OK',
      data: {
        authId: 'aa',
      },
    };
    response.status(200).json(responseBody);
  }

  @Get('')
  public async getAccountListByAdmin(
    @Req() request: ExpressRequest,
    @Res() response: ExpressResponse,
    @Param('userId') userId: string,
  ) {
    const accountList: AccountInfoOfDB[] = await this.datasource.transact(
      async (connect: PrismaClient) => {
        // ログイン済みを確認する
        const myAccount: AccountInfoOfDB =
          await this.adminAccountService.validateAuth(request, userId, connect);
        // アカウント情報を全て取得する
        return this.adminAccountService.getAllList(
          myAccount.authId,
          myAccount.authRole,
          connect,
        );
      },
    );

    const responseBody: ResponseBody<'getAccountListByAdmin'> = {
      message: 'OK',
      data: {
        accountList: accountList,
      },
    };
    response.status(200).json(responseBody);
  }

  @Get(':targetUserId')
  public async getAccountDetailByAdmin(
    @Req() request: ExpressRequest,
    @Res() response: ExpressResponse,
    @Param('userId') userId: string,
    @Param('targetUserId') targetUserId: string,
  ) {
    throw Unexpected(ErrorCode.Error1);
    const account: AccountInfoOfDB = await this.datasource.transact(
      async (connect: PrismaClient) => {
        // ログイン済みを確認する
        const myAccount: AccountInfoOfDB =
          await this.adminAccountService.validateAuth(request, userId, connect);

        // アカウント情報を全て取得する
        return this.adminAccountService.getDetail(
          myAccount.authId,
          myAccount.authRole,
          targetUserId,
          connect,
        );
      },
    );
    const responseBody: ResponseBody<'getAccountDetailByAdmin'> = {
      message: 'OK',
      data: {
        account: account,
      },
    };
    response.status(200).json(responseBody);
  }

  @ApiBody({ type: _UpdateAccountInfoDto })
  @Put(':targetUserId/update')
  public async updateAccountByAdmin(
    @Req() request: ExpressRequest,
    @Res() response: ExpressResponse,
    @Body() dto: RequestBody<'updateAccountByAdmin'>,
    @Param('userId') userId: string,
    @Param('targetUserId') targetUserId: string,
  ) {
    await this.datasource.transact(async (connect: PrismaClient) => {
      // ログイン済みを確認する
      const myAccount: AccountInfoOfDB =
        await this.adminAccountService.validateAuth(request, userId, connect);
      // アカウント情報を更新する
      await this.adminAccountService.update(
        myAccount.authId,
        myAccount.authRole,
        targetUserId,
        dto,
        connect,
      );
    });

    const responseBody: ResponseBody<'updateAccountByAdmin'> = {
      message: 'OK',
    };
    response.status(200).json(responseBody);
  }

  @Delete(':targetUserId/delete')
  public async deleteAccountByAdmin(
    @Req() request: ExpressRequest,
    @Res() response: ExpressResponse,
    @Param('userId') userId: string,
    @Param('targetUserId') targetUserId: string,
  ) {
    await this.datasource.transact(async (connect: PrismaClient) => {
      // ログイン済みを確認する
      const myAccount: AccountInfoOfDB =
        await this.adminAccountService.validateAuth(request, userId, connect);
      // アカウント情報を更新する
      await this.adminAccountService.delete(
        myAccount.authId,
        myAccount.authRole,
        targetUserId,
        connect,
      );
    });

    const responseBody: ResponseBody<'deleteAccountByAdmin'> = {
      message: 'OK',
    };
    response.status(200).json(responseBody);
  }

  @ApiBody({ type: _BulkDeleteAccountInfoDto })
  @Post('bulkDelete')
  public async bulkDeleteAccountByAdmin(
    @Req() request: ExpressRequest,
    @Res() response: ExpressResponse,
    @Body() dto: RequestBody<'bulkDeleteAccountByAdmin'>,
    @Param('userId') userId: string,
  ) {
    if (Object.keys(dto.userIdList).length === 0)
      throw BadRequest(ErrorCode.Error42);
    await this.datasource.transact(async (connect: PrismaClient) => {
      // ログイン済みを確認する
      const myAccount: AccountInfoOfDB =
        await this.adminAccountService.validateAuth(request, userId, connect);
      // アカウント情報を更新する
      await this.adminAccountService.bulkDelete(
        myAccount.authId,
        myAccount.authRole,
        dto,
        connect,
      );
    });
    const responseBody: ResponseBody<'bulkDeleteAccountByAdmin'> = {
      message: 'OK',
    };
    response.status(200).json(responseBody);
  }
}
