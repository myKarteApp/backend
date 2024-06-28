import { Injectable, Scope } from '@nestjs/common';
import { v4 } from 'uuid';
import { Response as ExpressResponse } from 'express';
import { LoginSession, PrismaClient } from '@prisma/client';
import { NotFound } from '@/utils/error';
import { JwsTokenProvider } from '../jws/jwsToken.provider';
import { MainDatasourceProvider } from '@/datasource';
import { JwsTokenSchema } from '@/shared';
import { ErrorCode } from '@/utils/errorCode';

@Injectable({ scope: Scope.REQUEST })
export class HttpCookieService {
  loginSessionKey: string;
  constructor(
    protected readonly datasource: MainDatasourceProvider,
    public readonly jwsTokenProvider: JwsTokenProvider,
  ) {
    if (!process.env.AUTH_LOGIN_SESSION_KEY) throw NotFound(ErrorCode.Error4);
    this.loginSessionKey = process.env.AUTH_LOGIN_SESSION_KEY;
  }

  public async setAuthSessionId(
    response: ExpressResponse,
    jwsToken: string,
    _connect?: PrismaClient,
  ) {
    const sessionId = v4();

    const now = new Date(0);
    now.setHours(now.getHours() + 24);
    const con = await this.connect(_connect);
    await con.loginSession.create({
      data: {
        sessionId: sessionId,
        jwsToken: jwsToken,
        expiredAt: now,
      },
    });

    response.cookie(this.loginSessionKey, sessionId, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });
  }

  public async clearAuthSessionId(
    response: ExpressResponse,
    sessionId: string,
    _connect?: PrismaClient,
  ) {
    const con = await this.connect(_connect);
    await con.loginSession.update({
      where: {
        sessionId: sessionId,
      },
      data: {
        isDeleted: false,
      },
    });
    response.clearCookie(this.loginSessionKey);
  }

  public async validateLoginSession(
    authId: string,
    sessionId: string,
    _connect?: PrismaClient,
  ): Promise<void> {
    // セッションIDが無効なら、エラーが発生する
    const con = await this.connect(_connect);
    const loginSession: LoginSession | null = await con.loginSession.findUnique(
      {
        where: {
          sessionId: sessionId,
          isDeleted: false,
        },
      },
    );
    if (!loginSession) throw NotFound(ErrorCode.Error5);
    if (loginSession.jwsToken === '') throw NotFound(ErrorCode.Error6);
    const decryptedJwsToken = this.jwsTokenProvider.decryptJwsToken(
      loginSession.jwsToken,
    );
    if (decryptedJwsToken.payload.authId !== authId)
      throw NotFound(ErrorCode.Error7);
    if (decryptedJwsToken.isExpired) throw NotFound(ErrorCode.Error8);
  }

  public async validateAuthCookie(
    sessionId: string,
    _connect?: PrismaClient,
  ): Promise<JwsTokenSchema> {
    // セッションIDが無効なら、エラーが発生する
    const con = await this.connect(_connect);
    const loginSession: LoginSession | null = await con.loginSession.findUnique(
      {
        where: {
          sessionId: sessionId,
          isDeleted: false,
        },
      },
    );
    if (!loginSession) throw NotFound(ErrorCode.Error9);
    if (loginSession.jwsToken === '') throw NotFound(ErrorCode.Error10);
    const decryptedJwsToken = this.jwsTokenProvider.decryptJwsToken(
      loginSession.jwsToken,
    );
    if (decryptedJwsToken.isExpired) throw NotFound(ErrorCode.Error11);

    return decryptedJwsToken;
  }

  protected async connect(
    _connect: PrismaClient | undefined,
  ): Promise<PrismaClient> {
    const con = _connect ? _connect : this.datasource.connect;
    if (con !== undefined) return con;

    await this.datasource.setConnect();
    return this.datasource.connect;
  }
}
