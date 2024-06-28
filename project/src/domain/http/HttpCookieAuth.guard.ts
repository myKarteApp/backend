// auth.guard.ts

import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { HttpCookieService } from './HttpCookie.service';
import { Unauthorized } from '@/utils/error';
import { HttpAuthRequest } from './HttpAuthDto';
import { ErrorCode } from '@/utils/errorCode';
import { MainDatasourceProvider } from '@/datasource';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class HttpCookieAuthGuard implements CanActivate {
  constructor(
    protected readonly datasource: MainDatasourceProvider,
    private readonly cookieService: HttpCookieService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<HttpAuthRequest>();

    const sessionId = request.cookies[this.cookieService.loginSessionKey];
    if (!sessionId) throw Unauthorized(ErrorCode.Error15);

    const decryptedJwsToken = await this.datasource.transact(
      async (connect: PrismaClient) => {
        return this.cookieService.validateAuthCookie(sessionId, connect);
      },
    );

    request.authId = decryptedJwsToken.payload.authId;

    return true;
  }
}
