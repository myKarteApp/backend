import { Module } from '@nestjs/common';
import { AdminDatasourceProvider } from './adminDatasource.provider';

@Module({
  providers: [AdminDatasourceProvider],
  exports: [AdminDatasourceProvider],
})
export class AdminDatasourceModule {}
