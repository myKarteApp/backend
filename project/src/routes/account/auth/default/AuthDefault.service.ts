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
        isVerify: false,
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
