import { Module } from '@nestjs/common';
import { DomainAuthDefaultProvider } from './DomainAuthDefault.provider';
import { DomainAuthVerifyOneTimePassProvider } from '../DomainAuthVerifyOneTimePass.provider';

@Module({
  imports: [DomainAuthDefaultProvider],
  providers: [DomainAuthDefaultProvider, DomainAuthVerifyOneTimePassProvider],
  exports: [DomainAuthDefaultProvider],
})
export class DomainAuthDefaultModule {}
