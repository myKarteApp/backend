import { Module } from '@nestjs/common';
import { DomainAuthVerifyOneTimePassProvider } from './DomainAuthVerifyOneTimePass.provider';
import { DomainAuthDefaultModule } from './default/DomainAuthDefault.module';

@Module({
  imports: [DomainAuthDefaultModule],
  providers: [DomainAuthVerifyOneTimePassProvider],
  exports: [DomainAuthVerifyOneTimePassProvider],
})
export class DomainAuthModule {}
