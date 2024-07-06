import { Module } from '@nestjs/common';

import { AdminDatasourceModule } from '@/datasource';
import { DomainModule } from '@/domain/domain.module';
import { ConfigModule } from '@/config/config.module';
import { AdminAccountController } from './AdminAccount.controller';
import { DomainAuthDefaultProvider } from '@/domain/account/auth/default/DomainAuthDefault.provider';
import { AdminAccountService } from './AdminAccount.service';
import { DomainAccountGetListProvider } from '@/domain/account/DomainAccountGetList.provider';
import { DomainAccountProvider } from '@/domain/account/DomainAccount.provider';
import { DomainAccountGetDetailProvider } from '@/domain/account/DomainAccountGetDetail.provider';
import { DomainUserProvider } from '@/domain/account/user/DomainUser.provider';

@Module({
  imports: [ConfigModule, AdminDatasourceModule, DomainModule],
  providers: [
    AdminAccountService,
    // 認証用
    DomainAccountProvider,
    // create
    DomainAuthDefaultProvider,
    DomainUserProvider,
    // read
    DomainAccountGetListProvider,
    DomainAccountGetDetailProvider,
  ],
  controllers: [AdminAccountController],
})
export class RouterAdminAccountModule {}
