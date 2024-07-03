import { Module } from '@nestjs/common';

import { AuthCookieProvider } from '@/domain/http';
import { MainDatasourceModule } from '@/datasource';
import { AuthDefaultController } from './AuthDefault.controller';
import { DomainModule } from '@/domain/domain.module';
import { DomainAuthDefaultProvider } from '@/domain/account/auth';
import { AuthDefaultService } from './AuthDefault.service';

@Module({
  imports: [MainDatasourceModule, DomainModule],
  providers: [
    AuthDefaultService,
    DomainAuthDefaultProvider,
    AuthCookieProvider,
  ],
  controllers: [AuthDefaultController],
})
export class RouterAuthDefaultModule {}
