import { Injectable, Scope } from '@nestjs/common';
import { AuthInfo, AuthVerifyOneTimePass, PrismaClient } from '@prisma/client';
import { MainDatasourceProvider } from '@/datasource';
import { DomainAuthDefaultProvider } from '@/domain/account/auth/default/DomainAuthDefault.provider';
import { DomainAuthVerifyOneTimePassProvider } from '@/domain/account/auth/DomainAuthVerifyOneTimePass.provider';
import { NotFound } from '@/utils/error';
import { ErrorCode } from '@/utils/errorCode';

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

  public async findByEmailAndPassword(
    email: string,
    password: string,
    _connect?: PrismaClient,
  ): Promise<AuthInfo | null> {
    return this.authDefaultProvider.findByEmailAndPassword(
      email,
      password,
      _connect,
    );
  }

  public async verifyAuthInfo(
    authId: string,
    updatedBy: string,
    _connect?: PrismaClient,
  ): Promise<AuthInfo | null> {
    return this.authDefaultProvider.verifyAuthInfo(authId, updatedBy, _connect);
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

  public async findOTP(
    passCode: string,
    queryToken: string,
    _connect?: PrismaClient,
  ): Promise<AuthVerifyOneTimePass> {
    const otp = await this.authVerifyOneTimePassProvider.findOTP(
      passCode,
      queryToken,
      _connect,
    );
    if (!otp) throw NotFound(ErrorCode.Error43);
    if (otp.expiresAt < new Date()) throw NotFound(ErrorCode.Error44);
    return otp;
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
