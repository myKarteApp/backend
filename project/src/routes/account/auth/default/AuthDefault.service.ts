import { Injectable, Scope } from '@nestjs/common';
import { AuthInfo, AuthType, PrismaClient } from '@prisma/client';
import { AuthRole, DefaultAuthDto } from '@/shared';
import { MainDatasourceProvider } from '@/datasource';
import { DomainAuthDefaultProvider } from '@/domain/account/auth';

@Injectable({ scope: Scope.REQUEST })
export class AuthDefaultService {
  constructor(
    protected readonly datasource: MainDatasourceProvider,
    private readonly authDefaultProvider: DomainAuthDefaultProvider,
  ) {
    this.authDefaultProvider.datasource = datasource;
  }
  /*
    create
  */
  public async createAuthInfo(
    dto: DefaultAuthDto,
    newAuthId: string,
    _connect?: PrismaClient,
  ): Promise<void> {
    await this.authDefaultProvider.createAuthInfo(
      {
        authId: newAuthId,
        email: dto.email,
        password: dto.password,
        authType: AuthType.default,
        authRole: AuthRole.client,
        identityConfirmed: false,
      },
      _connect,
    );
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
      AuthRole.client,
      _connect,
    );
  }

  public async findByEmail(
    dto: DefaultAuthDto,
    _connect?: PrismaClient,
  ): Promise<AuthInfo | null> {
    return this.authDefaultProvider.findByEmail(
      dto,
      AuthType.default,
      AuthRole.client,
      _connect,
    );
  }
}
