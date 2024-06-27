import { DynamicModule, Module } from '@nestjs/common';
import { JwsTokenProvider } from './jwsToken.provider';

@Module({
  providers: [JwsTokenProvider],
  exports: [JwsTokenProvider],
  controllers: [],
})
export class JwsModule {
  static forRoot(): DynamicModule {
    return {
      module: JwsModule,
      providers: [JwsTokenProvider],
      exports: [JwsTokenProvider],
    };
  }
}
