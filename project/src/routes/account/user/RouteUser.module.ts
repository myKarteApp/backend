import { Module } from '@nestjs/common';
import { MainDatasourceModule } from '@/datasource';
import { UserController } from './User.controller';
import { UserService } from './User.service';
import { DomainModule } from '@/domain/domain.module';
import { DomainUserProvider } from '@/domain/account/user/DomainUser.provider';

@Module({
  imports: [MainDatasourceModule, DomainModule],
  providers: [UserService, DomainUserProvider],
  controllers: [UserController],
})
export class RouteUserModule {}
