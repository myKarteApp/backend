import { Injectable, Scope } from '@nestjs/common';
import {
  AuthInfo,
  AuthType,
  AuthVerifyOneTimePass,
  PrismaClient,
} from '@prisma/client';
import { AuthRole, DefaultAuthDto } from '@/shared';
import { MainDatasourceProvider } from '@/datasource';
import { Request as ExpressRequest } from 'express';
import { DomainAuthDefaultProvider } from '@/domain/account/auth/default/DomainAuthDefault.provider';
import { DomainAuthVerifyOneTimePassProvider } from '@/domain/account/auth/DomainAuthVerifyOneTimePass.provider';

@Injectable({ scope: Scope.REQUEST })
export class AuthDefaultService {
  constructor(
    protected readonly datasource: MainDatasourceProvider,
    private readonly authDefaultProvider: DomainAuthDefaultProvider,
    private readonly authVerifyOneTimePassProvider: DomainAuthVerifyOneTimePassProvider,
  ) {
    this.authDefaultProvider.datasource = datasource;
  }
  /* ====================
    AuthInfo
  ==================== */
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
        authRole: dto.authRole ? dto.authRole : AuthRole.client,
        isVerify: false,
        isTrial: false,
      },
      _connect,
    );
  }

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
  public async verifyAuth(
    authId: string,
    _connect?: PrismaClient,
  ): Promise<AuthInfo | null> {
    return this.authDefaultProvider.verifyAuthInfo(authId, _connect);
  }

  public async findByEmailAndPassword(
    email: string,
    password,
    _connect?: PrismaClient,
  ): Promise<AuthInfo | null> {
    return this.authDefaultProvider.findByEmailAndPassword(
      email,
      password,
      _connect,
    );
  }
  /* ====================
    OTP
  ==================== */
  public async createOneTimePass(
    authId: string,
    request: ExpressRequest,
    _connect?: PrismaClient,
  ): Promise<string> {
    return this.authVerifyOneTimePassProvider.create(authId, request, _connect);
  }

  public async findOneTimePassById(
    authVerifyOneTimePassId: string,
    _connect?: PrismaClient,
  ): Promise<AuthVerifyOneTimePass | null> {
    return this.authVerifyOneTimePassProvider.findById(
      authVerifyOneTimePassId,
      _connect,
    );
  }
}
