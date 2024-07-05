import { Module } from '@nestjs/common';
import { DomainAuthVerifyOneTimePassProvider } from './DomainAuthVerifyOneTimePass.provider';
import { DomainAuthDefaultModule } from './default/DomainAuthDefault.module';
import { ConfigModule } from '@/config/config.module';

@Module({
  imports: [ConfigModule, DomainAuthDefaultModule],
  providers: [DomainAuthVerifyOneTimePassProvider],
  exports: [DomainAuthVerifyOneTimePassProvider],
})
export class DomainAuthModule {}
