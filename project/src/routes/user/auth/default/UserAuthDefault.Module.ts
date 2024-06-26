import { Module } from '@nestjs/common';
import { UserAuthDefaultService } from './UserAuthDefault.service';
import { UserAuthDefaultController } from './UserAuthDefault.controller';
import { MainDatasourceModule } from '@/datasource/mainDatasource.module';

@Module({
  imports: [MainDatasourceModule],
  providers: [UserAuthDefaultService],
  controllers: [UserAuthDefaultController],
})
export class UserAuthDefaultModule {}
