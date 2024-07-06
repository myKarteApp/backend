import { AdminDatasourceProvider } from '@/datasource';
import { DomainAuthDefaultProvider } from '@/domain/account/auth/default/DomainAuthDefault.provider';
import { AuthRole } from '@/shared';
import { Injectable } from '@nestjs/common';
import { AuthInfo, AuthType, PrismaClient } from '@prisma/client';

@Injectable()
export class AdminService {
  constructor(
    protected readonly datasource: AdminDatasourceProvider,
    private readonly authDefaultProvider: DomainAuthDefaultProvider,
  ) {
    this.authDefaultProvider.datasource = datasource;
  }

  /*
    read
  */
  public async findById(
    authId: string,
    _connect?: PrismaClient,
  ): Promise<AuthInfo | null> {
    return this.authDefaultProvider.findById(
      authId,
      AuthType.default,
      AuthRole.admin,
      _connect,
    );
  }

  // public async findByEmail(
  //   dto: DefaultAuthDto,
  //   _connect?: PrismaClient,
  // ): Promise<AuthInfo | null> {
  //   return this.authDefaultProvider.findByEmail(
  //     dto,
  //     AuthType.default,
  //     AuthRole.admin,
  //     _connect,
  //   );
  // }
}
