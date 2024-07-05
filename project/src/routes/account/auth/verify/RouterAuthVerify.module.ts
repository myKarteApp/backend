import { Module } from '@nestjs/common';

import { MainDatasourceModule } from '@/datasource';
import { DomainModule } from '@/domain/domain.module';
import { AuthVerifyController } from './AuthVerify.controller';
import { AuthVerifyService } from './AuthVerify.service';
import { DomainAuthDefaultProvider } from '@/domain/account/auth/default/DomainAuthDefault.provider';
import { DomainAuthVerifyOneTimePassProvider } from '@/domain/account/auth/DomainAuthVerifyOneTimePass.provider';

@Module({
  imports: [MainDatasourceModule, DomainModule],
  providers: [
    AuthVerifyService,
    DomainAuthDefaultProvider,
    DomainAuthVerifyOneTimePassProvider,
  ],
  controllers: [AuthVerifyController],
})
export class RouterAuthVerifyModule {}
