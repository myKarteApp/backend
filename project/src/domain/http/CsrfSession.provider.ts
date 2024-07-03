import { Injectable, Scope } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { NotFound, Unauthorized } from '@/utils/error';
import { JwsTokenProvider } from '../jws/jwsToken.provider';
import { MainDatasourceProvider } from '@/datasource';
import { ErrorCode } from '@/utils/errorCode';
import { Request as ExpressRequest } from 'express';
import { v4 } from 'uuid';
import { CSRF_HEADER } from '@/shared';

@Injectable({ scope: Scope.REQUEST })
export class CsrfSessionProvider {
  sessionKey: string;
  constructor(
    protected readonly datasource: MainDatasourceProvider,
    public readonly jwsTokenProvider: JwsTokenProvider,
  ) {
    if (!process.env.CSRF_SESSION_KEY) throw NotFound(ErrorCode.Error34);
    this.sessionKey = process.env.CSRF_SESSION_KEY;
  }
  public setCsrfToken(request: ExpressRequest): string {
    const csrfToken = v4();
    request.session[this.sessionKey] = csrfToken;
    return csrfToken;
  }
  public verifyCsrfToken(request: ExpressRequest): void {
    console.log(`
      request.session[this.sessionKey] = ${request.session[this.sessionKey]}
      request.headers[CSRF_HEADER] = ${request.headers[CSRF_HEADER]},
    `);
    console.log(request.headers);
    if (request.session[this.sessionKey] !== request.headers[CSRF_HEADER])
      throw Unauthorized(ErrorCode.Error37);
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
