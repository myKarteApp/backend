import { MainDatasourceProvider } from '@/datasource';
import { ResponseBody, UserInfoDto } from '@/shared';
import { Body, Controller, Post } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { v4 } from 'uuid';
import { UserService } from './User.service';
import { Response as ExpressResponse } from 'express';

@Controller('/account/user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly datasource: MainDatasourceProvider,
  ) {}

  @Post('create')
  async create(@Body() dto: UserInfoDto, response: ExpressResponse) {
    const newUserId = v4();
    await this.datasource.transact(async (connect: PrismaClient) => {
      await this.userService.createUserInfo(dto, newUserId, connect);
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
