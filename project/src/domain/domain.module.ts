import { Module } from '@nestjs/common';
import { DomainHttpModule } from './http';
import { DomainJwsModule } from './jws';
import { DomainAuthModule } from './account/roles/client/DomainClientAuth.module';

@Module({
  imports: [DomainAuthModule, DomainHttpModule, DomainJwsModule],
  exports: [DomainAuthModule, DomainHttpModule, DomainJwsModule],
})
export class DomainModule {}
