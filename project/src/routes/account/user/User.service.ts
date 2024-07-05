import { Injectable, Scope } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CreateUserInfo, UserInfoDto } from '@/shared';
import { MainDatasourceProvider } from '@/datasource';
import { DomainUserProvider } from '@/domain/account/user/DomainUser.provider';

@Injectable({ scope: Scope.REQUEST })
export class UserService {
  constructor(
    protected readonly datasource: MainDatasourceProvider,
    private readonly userProvider: DomainUserProvider,
  ) {
    this.userProvider.datasource = datasource;
  }
  /*
    create
  */
  public async createUserInfo(
    dto: CreateUserInfo,
    authId: string,
    newUserId: string,
    _connect?: PrismaClient,
  ): Promise<void> {
    await this.userProvider.createUserInfo(
      {
        authId: authId,
        userId: newUserId,
        ...dto,
      },
      _connect,
    );
  }

  // /*
  //   read
  // */
  // public async findById(
  //   authId: string,
  //   _connect?: PrismaClient,
  // ): Promise<AuthInfo | null> {
  //   return this.authDefaultProvider.findById(
  //     authId,
  //     AuthType.default,
  //     AuthRole.client,
  //     _connect,
  //   );
  // }

  // public async findByEmail(
  //   dto: DefaultAuthDto,
  //   _connect?: PrismaClient,
  // ): Promise<AuthInfo | null> {
  //   return this.authDefaultProvider.findByEmail(
  //     dto,
  //     AuthType.default,
  //     AuthRole.client,
  //     _connect,
  //   );
  // }
}
