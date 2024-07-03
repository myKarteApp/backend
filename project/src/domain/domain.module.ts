import { Module } from '@nestjs/common';
import { DomainHttpModule } from './http';
import { DomainJwsModule } from './jws';
import { DomainAuthModule } from './account/roles/client/DomainClientAuth.module';
import { MailModule } from './mail/DomainMail.module';

@Module({
  imports: [DomainAuthModule, DomainHttpModule, DomainJwsModule, MailModule],
  exports: [DomainAuthModule, DomainHttpModule, DomainJwsModule, MailModule],
})
export class DomainModule {}
