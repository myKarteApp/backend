import { Module } from '@nestjs/common';
import { DomainClientModule } from './roles/client/DomainClient.module';
import { DomainUserModel } from './user/DomainUser.module';
import { DomainAuthDefaultModule } from './auth/default/DomainAuthDefault.module';
import { DomainAuthModule } from './auth/DomainAuth.module';
import { DomainAccountProvider } from './DomainAccount.provider';
import { DomainAccountGetListProvider } from './DomainAccountGetList.provider';
import { DomainAccountGetDetailProvider } from './DomainAccountGetDetail.provider';
import { DomainAccountGetListByIdListProvider } from './DomainAccountGetListByIdList.provider';

@Module({
  imports: [],
  providers: [
    DomainAccountProvider,
    DomainAccountGetListProvider,
    DomainAccountGetDetailProvider,
    DomainAccountGetListByIdListProvider,
    // 内部
    DomainAuthModule,
    DomainClientModule,
    DomainUserModel,
    DomainAuthDefaultModule,
  ],
  exports: [
    DomainAccountProvider,
    DomainAccountGetListProvider,
    DomainAccountGetDetailProvider,
    DomainAccountGetListByIdListProvider,
    // 内部
    DomainAuthModule,
    DomainClientModule,
    DomainUserModel,
    DomainAuthDefaultModule,
  ],
})
export class DomainAccountModule {}
