import { Module } from '@nestjs/common';
import { MainDatasourceModule } from '@/datasource';
import { DomainJwsModule, JwsTokenProvider } from '../jws';
import { AuthCookieProvider } from './AuthCookie.provider';
import { HttpCookieAuthGuard } from './HttpCookieAuth.guard';
import { CsrfSessionProvider } from './CsrfSession.provider';

@Module({
  imports: [MainDatasourceModule, DomainJwsModule],
  exports: [
    AuthCookieProvider,
    CsrfSessionProvider,
    JwsTokenProvider,
    HttpCookieAuthGuard,
  ],
  providers: [
    AuthCookieProvider,
    CsrfSessionProvider,
    JwsTokenProvider,
    HttpCookieAuthGuard,
  ],
  controllers: [],
})
export class DomainHttpModule {}
