import { Module } from '@nestjs/common';

import { AuthCookieProvider } from '@/domain/http';
import { MainDatasourceModule } from '@/datasource';
import { AuthDefaultController } from './AuthDefault.controller';
import { DomainModule } from '@/domain/domain.module';
import { AuthDefaultService } from './AuthDefault.service';
import { DomainAuthDefaultProvider } from '@/domain/account/auth/default/DomainAuthDefault.provider';
import { DomainAuthVerifyOneTimePassProvider } from '@/domain/account/auth/DomainAuthVerifyOneTimePass.provider';

@Module({
  imports: [MainDatasourceModule, DomainModule],
  providers: [
    AuthDefaultService,
    DomainAuthDefaultProvider,
    AuthCookieProvider,
    DomainAuthVerifyOneTimePassProvider,
  ],
  controllers: [AuthDefaultController],
})
export class RouterAuthDefaultModule {}
