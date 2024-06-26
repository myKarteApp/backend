import { Module } from '@nestjs/common';
import { DomainAuthModule } from './auth/DomainAuth.module';
import { DomainUserModel } from './user/DomainUser.module';

@Module({
  providers: [DomainAuthModule, DomainUserModel],
  exports: [DomainAuthModule, DomainUserModel],
})
export class DomainAccountModule {}
