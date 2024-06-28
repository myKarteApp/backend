import { Injectable, Scope } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { UserInfoDto } from '@/shared';
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
    dto: UserInfoDto,
    newUserId: string,
    _connect?: PrismaClient,
  ): Promise<void> {
    await this.userProvider.createUserInfo(
      {
        userId: newUserId,
        authId: dto.authId,
        birthDay: dto.birthDay,
        sex: dto.sex,
        gender: dto.gender,
        familyName: dto.familyName,
        givenName: dto.givenName,
        address: dto.address,
        tel: dto.tel,
        profession: dto.profession,
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
