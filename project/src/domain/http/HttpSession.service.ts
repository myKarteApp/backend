import { Injectable } from '@nestjs/common';
import { v4 } from 'uuid';
import { Response as ExpressResponse } from 'express';
import { LoginSession, PrismaClient } from '@prisma/client';
import { NotFound } from '@/utils/error';
import { JwsTokenProvider } from '../jws/jwsToken.provider';
import { MainDatasourceProvider } from '@/datasource';

@Injectable()
export class HttpSessionService {
  loginSessionKey: string;
  constructor(
    protected readonly datasource: MainDatasourceProvider,
    public readonly jwsTokenProvider: JwsTokenProvider,
  ) {}

  public async setAuthSessionId(
    response: ExpressResponse,
    jwsToken: string,
    _connect?: PrismaClient,
  ) {
    const sessionId = v4();

    const now = new Date(0);
    now.setHours(now.getHours() + 24);

    await this.connect(_connect).loginSession.create({
      data: {
        sessionId: sessionId,
        jwsToken: jwsToken,
        expiredAt: now,
      },
    });

    response.cookie(this.loginSessionKey, sessionId, {
      httpOnly: true, // クライアント側のJavaScriptからはアクセスできないようにする
      maxAge: 24 * 60 * 60 * 1000, // Cookieの有効期限（例では24時間）
    });
  }

  public async clearAuthSessionId(
    response: ExpressResponse,
    sessionId: string,
    _connect?: PrismaClient,
  ) {
    await this.connect(_connect).loginSession.update({
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
  ): Promise<void> {
    const loginSession: LoginSession | null = await this.connect(
      undefined,
    ).loginSession.findUnique({
      where: {
        sessionId: sessionId,
      },
    });
    if (!loginSession) throw NotFound('Error2');
    if (loginSession.jwsToken === '') throw NotFound('Error3');
    const decryptedJwsToken = this.jwsTokenProvider.decryptJwsToken(
      loginSession.jwsToken,
    );
    if (decryptedJwsToken.payload.authId !== authId) throw NotFound('Error3');
    if (decryptedJwsToken.isExpired) throw NotFound('Error4');
  }
  protected connect(_connect: PrismaClient | undefined): PrismaClient {
    return _connect ? _connect : this.datasource.connect;
  }
}
