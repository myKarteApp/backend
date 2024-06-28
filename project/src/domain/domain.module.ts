import { Module } from '@nestjs/common';
import { DomainHttpModule } from './http';
import { DomainJwsModule } from './jws';
import { DomainAuthModule } from './account/auth/DomainAuth.module';

@Module({
  imports: [DomainAuthModule, DomainHttpModule, DomainJwsModule],
  exports: [DomainAuthModule, DomainHttpModule, DomainJwsModule],
})
export class DomainModule {}
