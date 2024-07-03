import { Module } from '@nestjs/common';
import { MainDatasourceModule } from '@/datasource';
import { DomainJwsModule, JwsTokenProvider } from '../jws';
import { AuthCookieProvider } from './AuthCookie.provider';
import { HttpCookieAuthGuard } from './HttpCookieAuth.guard';
import { CsrfCookieProvider } from './CsrfCookie.provider';

@Module({
  imports: [MainDatasourceModule, DomainJwsModule],
  exports: [AuthCookieProvider, CsrfCookieProvider],
  providers: [
    AuthCookieProvider,
    CsrfCookieProvider,
    JwsTokenProvider,
    HttpCookieAuthGuard,
  ],
  controllers: [],
})
export class DomainHttpModule {}
