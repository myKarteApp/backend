import { DynamicModule, Module } from '@nestjs/common';
import { MainDatasourceModule } from '@/datasource';
import { JwsModule, JwsTokenProvider } from '../jws';
import { HttpSessionService } from './HttpSession.service';

@Module({
  imports: [MainDatasourceModule, JwsModule],
  exports: [HttpSessionService],
  providers: [HttpSessionService, JwsTokenProvider],
  controllers: [],
})
export class HttpModule {
  static forRoot(): DynamicModule {
    return {
      module: HttpModule,
      providers: [HttpSessionService],
      exports: [HttpSessionService],
    };
  }
  static nestDi() {
    return [JwsModule];
  }
}
