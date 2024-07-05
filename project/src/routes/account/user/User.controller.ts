import { MainDatasourceProvider } from '@/datasource';
import { CreateUserInfo, ResponseBody } from '@/shared';
import { Body, Controller, Param, Post, Res } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { v4 } from 'uuid';
import { UserService } from './User.service';
import { Response as ExpressResponse } from 'express';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { _CreateUserInfo } from './swaggerDto';

@ApiTags('AccountUser')
@Controller('/account/user')
export class UserController {
  // TODO: 修正等はAccount系のコントローラーで処理する？
  constructor(
    private readonly userService: UserService,
    private readonly datasource: MainDatasourceProvider,
  ) {}
  @ApiBody({ type: _CreateUserInfo })
  @Post(':authId/create')
  async create(
    @Res() response: ExpressResponse,
    @Param('authId') authId: string,
    @Body() dto: CreateUserInfo,
  ) {
    // 自分自身のユーザーを作る
    const newUserId = v4();
    await this.datasource.transact(async (connect: PrismaClient) => {
      await this.userService.createUserInfo(dto, authId, newUserId, connect);
    });

    const responseBody: ResponseBody<'createUserInfo'> = {
      message: 'OK',
      data: {
        userId: newUserId,
      },
    };
    response.status(200).json(responseBody);
  }
}
