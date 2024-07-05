import { Module } from '@nestjs/common';
import { DomainClientModule } from './roles/client/DomainClient.module';
import { DomainUserModel } from './user/DomainUser.module';
import { DomainAuthDefaultModule } from './auth/default/DomainAuthDefault.module';
import { DomainAuthModule } from './auth/DomainAuth.module';

@Module({
  imports: [],
  providers: [
    DomainAuthModule,
    DomainClientModule,
    DomainUserModel,
    DomainAuthDefaultModule,
  ],
  exports: [
    DomainAuthModule,
    DomainClientModule,
    DomainUserModel,
    DomainAuthDefaultModule,
  ],
})
export class DomainAccountModule {}
