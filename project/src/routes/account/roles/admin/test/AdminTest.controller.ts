import { Controller, Param, Post, Req, Res } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';

import {
  Request as ExpressRequest,
  Response as ExpressResponse,
} from 'express';

import { AdminDatasourceProvider } from '@/datasource';
import { AuthInfo, AuthType, PrismaClient } from '@prisma/client';
import { AccountInfoOfDB, AuthRole, CreateAccountInfoDto, DefaultColumns, getEnumValue, SexType } from '@/shared';
import { AdminTestService } from './AdminTest.service';
import { v4 } from 'uuid';
import { faker } from '@faker-js/faker';

@ApiTags('AdminTest')
@Controller('/admin/:userId/test')
export class AdminAccountController {
  constructor(
    private readonly datasource: AdminDatasourceProvider,
    private readonly adminTestService: AdminTestService,
  ) {}

  @Post('')
  public async createAccountByAdmin(
    @Req() request: ExpressRequest,
    @Res() response: ExpressResponse,
    @Param('userId') userId: string,
  ) {
    await this.datasource.transact(async (connect: PrismaClient) => {
      // ログイン済みを確認する
      await this.adminTestService.validateAuth(request, userId, connect);
      faker.person.sex();

      for (let i = 0; i < 100; i++) {
        const randomNumber = Math.floor(Math.random() * 5) + 2;

        const dto: CreateAccountInfoDto = {
          email: faker.internet.email(),
          password: faker.internet.password(),
          authType: AuthType.default,
          authRole: randomNumber,
          isVerify: true,
          isTrial: false,
          user: {
            birthDay: new Date(),
            sex: getEnumValue(SexType, faker.person.sex()),
            gender: faker.person.gender(),
            familyName: faker.person.lastName(),
            givenName: faker.person.firstName(),
            address: faker.person.firstName(),
            tel: faker.phone.number(),
            profession: faker.person.jobTitle(),
          },
        };
        await this.adminTestService.create(dto, 'test_data', connect);
      }
    });

    const responseBody = {
      message: 'OK',
      data: {
        authId: 'aa',
      },
    };
    response.status(200).json(responseBody);
  }
}
