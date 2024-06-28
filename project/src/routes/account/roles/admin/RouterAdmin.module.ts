import { Module } from '@nestjs/common';
import { AdminService } from './Admin.service';
import { DomainHttpModule } from '@/domain/http';
import { AdminDatasourceModule } from '@/datasource/admin/adminDatasource.module';
import { DomainModule } from '@/domain/domain.module';
import { AdminDatasourceProvider } from '@/datasource';
import { AdminAuthDefaultController } from './auth/default/AdminAuthDefault.controller';
import { DomainAuthDefaultProvider } from '@/domain/account/auth';
import { AdminClientController } from './client/AdminClient.controller';

@Module({
  imports: [AdminDatasourceModule, DomainModule, DomainHttpModule],
  providers: [AdminService, AdminDatasourceProvider, DomainAuthDefaultProvider],
  controllers: [AdminAuthDefaultController, AdminClientController],
})
export class RouterAdminModule {}
