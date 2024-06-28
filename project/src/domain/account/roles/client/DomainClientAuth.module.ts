import { Module } from '@nestjs/common';
import { DomainAuthDefaultProvider } from '../../auth';
import { DomainClientGetListProvider } from './DomainClientGetList.provider';

@Module({
  providers: [DomainAuthDefaultProvider, DomainClientGetListProvider],
  exports: [DomainAuthDefaultProvider, DomainClientGetListProvider],
})
export class DomainAuthModule {}
