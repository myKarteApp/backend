import { Module } from '@nestjs/common';
import { DomainAuthDefaultProvider } from '.';

@Module({
  providers: [DomainAuthDefaultProvider],
  exports: [DomainAuthDefaultProvider],
})
export class DomainAuthModule {}
