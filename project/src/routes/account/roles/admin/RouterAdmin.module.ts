import { Module } from '@nestjs/common';
import { AdminService } from './Admin.service';
import { AdminDatasourceModule } from '@/datasource/admin/adminDatasource.module';
import { AdminDatasourceProvider } from '@/datasource';
import { DomainAuthDefaultProvider } from '@/domain/account/auth/default/DomainAuthDefault.provider';
import { DomainClientGetListProvider } from '@/domain/account/roles/client/DomainClientGetList.provider';
import { DomainClientGetDetailProvider } from '@/domain/account/roles/client/DomainClientGetDetail.provider';
import { DomainModule } from '@/domain/domain.module';
import { RouterAdminAccountModule } from './account/RouterAdminAccount.module';
import { RouterAdminTestModule } from './test/AdminTest.module';

@Module({
  imports: [
    AdminDatasourceModule,
    DomainModule,
    RouterAdminAccountModule,
    RouterAdminTestModule,
  ],
  providers: [
    // メイン処理
    AdminService,
    // DB接続
    AdminDatasourceProvider,
    // 機能追加
    DomainAuthDefaultProvider,
    DomainClientGetListProvider,
    DomainClientGetDetailProvider,
    // AuthCookieProvider, // NOTE: 設定すると、AuthCookieProvider側でインジェクションが解決できなくなる。なぜ？
  ],
  controllers: [],
})
export class RouterAdminModule {}
