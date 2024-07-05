import { Module } from '@nestjs/common';
import { DomainClientGetDetailProvider } from './DomainClientGetDetail.provider';
import { DomainClientGetListProvider } from './DomainClientGetList.provider';

@Module({
  providers: [DomainClientGetListProvider, DomainClientGetDetailProvider],
  exports: [DomainClientGetListProvider, DomainClientGetDetailProvider],
})
export class DomainClientModule {}
