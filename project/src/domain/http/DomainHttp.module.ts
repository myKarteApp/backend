import { Module } from '@nestjs/common';
import { MainDatasourceModule } from '@/datasource';
import { DomainJwsModule, JwsTokenProvider } from '../jws';
import { HttpCookieService } from './HttpCookie.service';
import { HttpCookieAuthGuard } from './HttpCookieAuth.guard';

@Module({
  imports: [MainDatasourceModule, DomainJwsModule],
  exports: [HttpCookieService],
  providers: [HttpCookieService, JwsTokenProvider, HttpCookieAuthGuard],
  controllers: [],
})
export class DomainHttpModule {}
