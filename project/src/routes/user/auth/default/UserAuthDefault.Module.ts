import { Module } from '@nestjs/common';

import { HttpModule, HttpSessionService } from '@/domain/http';
import { MainDatasourceModule } from '@/datasource';
import { UserAuthDefaultService } from './UserAuthDefault.service';
import { UserAuthDefaultController } from './UserAuthDefault.controller';

@Module({
  imports: [MainDatasourceModule, ...HttpModule.nestDi()],
  providers: [UserAuthDefaultService, HttpSessionService],
  controllers: [UserAuthDefaultController],
})
export class UserAuthDefaultModule {}
