import { Module } from '@nestjs/common';
import { JwsTokenProvider } from './jwsToken.provider';

@Module({
  providers: [JwsTokenProvider],
  exports: [JwsTokenProvider],
  controllers: [],
})
export class DomainJwsModule {}
