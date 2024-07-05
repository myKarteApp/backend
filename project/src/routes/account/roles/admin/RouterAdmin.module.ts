import { Module } from '@nestjs/common';
import { AdminService } from './Admin.service';
import { AdminDatasourceModule } from '@/datasource/admin/adminDatasource.module';
import { AdminDatasourceProvider } from '@/datasource';
import { AdminAuthDefaultController } from './auth/default/AdminAuthDefault.controller';
import { AdminClientController } from './client/AdminClient.controller';
import { DomainAuthDefaultProvider } from '@/domain/account/auth/default/DomainAuthDefault.provider';
import { DomainClientGetListProvider } from '@/domain/account/roles/client/DomainClientGetList.provider';
import { DomainClientGetDetailProvider } from '@/domain/account/roles/client/DomainClientGetDetail.provider';
import { DomainModule } from '@/domain/domain.module';

@Module({
  imports: [AdminDatasourceModule, DomainModule],
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
  controllers: [AdminAuthDefaultController, AdminClientController],
})
export class RouterAdminModule {}
