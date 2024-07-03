import { Module } from '@nestjs/common';

import { MainDatasourceModule } from '@/datasource';
import { DomainModule } from '@/domain/domain.module';
import { AuthVerifyController } from './AuthVerify.controller';
import { AuthVerifyService } from './AuthVerify.service';

@Module({
  imports: [MainDatasourceModule, DomainModule],
  providers: [AuthVerifyService],
  controllers: [AuthVerifyController],
})
export class RouterAuthVerifyModule {}
