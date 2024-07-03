import { Injectable, Scope } from '@nestjs/common';
import {
  AuthInfo,
  AuthType,
  AuthVerifyOneTimePass,
  PrismaClient,
} from '@prisma/client';
import { AuthRole, DefaultAuthDto } from '@/shared';
import { MainDatasourceProvider } from '@/datasource';
import {
  DomainAuthDefaultProvider,
  DomainAuthVerifyOneTimePassProvider,
} from '@/domain/account/auth';

@Injectable({ scope: Scope.REQUEST })
export class AuthVerifyService {
  constructor(
    protected readonly datasource: MainDatasourceProvider,
    private readonly authDefaultProvider: DomainAuthDefaultProvider,
    private readonly authVerifyOneTimePassProvider: DomainAuthVerifyOneTimePassProvider,
  ) {
    this.authDefaultProvider.datasource = datasource;
  }

  /* ==================
    AuthInfo
  ================== */
  public async findAuthInfoById(
    authId: string,
    _connect?: PrismaClient,
  ): Promise<AuthInfo | null> {
    return this.authDefaultProvider.findById(
      authId,
      undefined,
      undefined,
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

  public async verifyAuthInfo(
    authId: string,
    _connect?: PrismaClient,
  ): Promise<AuthInfo | null> {
    return this.authDefaultProvider.verifyAuthInfo(authId, _connect);
  }
  /* =================
  OneTimePass
  ================= */

  public async findByQueryToken(
    queryToken: string,
    _connect?: PrismaClient,
  ): Promise<AuthVerifyOneTimePass | null> {
    return this.authVerifyOneTimePassProvider.findByQueryToken(
      queryToken,
      _connect,
    );
  }
  // public async findOneTimePassById(
  //   authVerifyOneTimePassId: string,
  //   _connect?: PrismaClient,
  // ): Promise<AuthVerifyOneTimePass | null> {
  //   return this.authVerifyOneTimePassProvider.findById(
  //     authVerifyOneTimePassId,
  //     _connect,
  //   );
  // }
}
