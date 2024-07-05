import { Module } from '@nestjs/common';
import { ConfigProvider } from './config.provider';

@Module({
  exports: [ConfigProvider],
  providers: [ConfigProvider],
})
export class ConfigModule {}
