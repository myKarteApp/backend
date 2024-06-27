import { Module } from '@nestjs/common';
import { MainDatasourceProvider } from './mainDatasource.provider';

@Module({
  providers: [MainDatasourceProvider],
  exports: [MainDatasourceProvider],
})
export class MainDatasourceModule {}
