import { Module } from '@nestjs/common';
import { DomainUserProvider } from './DomainUser.provider';

@Module({
  providers: [DomainUserProvider],
  exports: [DomainUserProvider],
})
export class DomainUserModel {}
