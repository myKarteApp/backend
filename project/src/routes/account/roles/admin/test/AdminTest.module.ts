import { Module } from '@nestjs/common';

import { AdminDatasourceModule } from '@/datasource';
import { DomainModule } from '@/domain/domain.module';
import { ConfigModule } from '@/config/config.module';
import { DomainAccountProvider } from '@/domain/account/DomainAccount.provider';
import { AdminTestService } from './AdminTest.service';
import { AdminAccountController } from './AdminTest.controller';
import { DomainAuthDefaultProvider } from '@/domain/account/auth/default/DomainAuthDefault.provider';
import { DomainUserProvider } from '@/domain/account/user/DomainUser.provider';

@Module({
  imports: [ConfigModule, AdminDatasourceModule, DomainModule],
  providers: [
    // 認証用
    DomainAccountProvider,
    AdminTestService,
    // create, update
    DomainAuthDefaultProvider,
    DomainUserProvider,
  ],
  controllers: [AdminAccountController],
})
export class RouterAdminTestModule {}
