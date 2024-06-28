import { Module } from '@nestjs/common';
import { RouterAuthDefaultModule } from './default';
import { MainDatasourceModule } from '@/datasource';

@Module({
  imports: [RouterAuthDefaultModule, MainDatasourceModule],
  exports: [RouterAuthDefaultModule],
})
export class RouteAuthModule {}
