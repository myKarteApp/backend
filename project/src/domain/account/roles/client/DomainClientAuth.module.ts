import { Module } from '@nestjs/common';
import {
  DomainAuthDefaultProvider,
  DomainAuthVerifyOneTimePassProvider,
} from '../../auth';
import { DomainClientGetListProvider } from './DomainClientUpdate.provider';
import { DomainClientGetDetailProvider } from './DomainClientGetDetail.provider';

@Module({
  providers: [
    DomainAuthDefaultProvider,
    DomainAuthVerifyOneTimePassProvider,
    DomainClientGetListProvider,
    DomainClientGetDetailProvider,
  ],
  exports: [
    DomainAuthDefaultProvider,
    DomainAuthVerifyOneTimePassProvider,
    DomainClientGetListProvider,
    DomainClientGetDetailProvider,
  ],
})
export class DomainAuthModule {}
