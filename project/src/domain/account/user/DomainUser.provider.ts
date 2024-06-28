import { Injectable, Scope } from '@nestjs/common';
import { PrismaClient, UserInfo } from '@prisma/client';
import { DefaultColumns } from '@/shared';
import { SpecDatasourceProvider } from '@/spec/SpecDatasource.provider';

@Injectable({ scope: Scope.REQUEST })
export class DomainUserProvider {
  public datasource: SpecDatasourceProvider;
  /*
    create
  */
  public async createUserInfo(
    data: Omit<UserInfo, DefaultColumns>,
    _connect?: PrismaClient,
  ): Promise<void> {
    await this.connect(_connect).userInfo.create({
      data: data,
    });
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
  protected connect(_connect: PrismaClient | undefined): PrismaClient {
    return _connect ? _connect : this.datasource.connect;
  }
}
