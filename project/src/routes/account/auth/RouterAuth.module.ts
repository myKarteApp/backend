import { Module } from '@nestjs/common';
import { RouterAuthDefaultModule } from './default';
import { MainDatasourceModule } from '@/datasource';
import { RouterAuthVerifyModule } from './verify/RouterAuthVerify.module';

@Module({
  imports: [
    MainDatasourceModule,
    RouterAuthDefaultModule,
    RouterAuthVerifyModule,
  ],
  exports: [RouterAuthDefaultModule, RouterAuthVerifyModule],
})
export class RouterAuthModule {}
