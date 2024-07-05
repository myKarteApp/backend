import { Module } from '@nestjs/common';
import { DomainHttpModule } from './http';
import { DomainJwsModule } from './jws';
import { MailModule } from './email/DomainMail.module';
import { DomainAccountModule } from './account/DomainAccount.module';

@Module({
  imports: [DomainAccountModule, DomainHttpModule, DomainJwsModule, MailModule],
  exports: [DomainAccountModule, DomainHttpModule, DomainJwsModule, MailModule],
})
export class DomainModule {}
