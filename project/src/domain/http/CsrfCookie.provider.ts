import { Injectable, Scope } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { NotFound } from '@/utils/error';
import { JwsTokenProvider } from '../jws/jwsToken.provider';
import { MainDatasourceProvider } from '@/datasource';
import { ErrorCode } from '@/utils/errorCode';

@Injectable({ scope: Scope.REQUEST })
export class CsrfCookieProvider {
  sessionKey: string;
  constructor(
    protected readonly datasource: MainDatasourceProvider,
    public readonly jwsTokenProvider: JwsTokenProvider,
  ) {
    if (!process.env.CSRF_SESSION_KEY) throw NotFound(ErrorCode.Error34);
    this.sessionKey = process.env.CSRF_SESSION_KEY;
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
