import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { controllerModuleList } from './routes';
import { APP_FILTER } from '@nestjs/core';
import { HttpExceptionFilter } from './filters/httpException.filter';
import { LoggerMiddleware } from './middleware/logger.middleware';
import * as cookieParser from 'cookie-parser';
import { HttpModule } from './domain/http';
import { JwsModule } from './domain/jws';
import { MainDatasourceModule } from './datasource';

@Module({
  imports: [
    MainDatasourceModule,
    HttpModule.forRoot(),
    JwsModule.forRoot(),
    ...controllerModuleList,
  ],
  exports: [MainDatasourceModule, HttpModule, JwsModule],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(cookieParser())
      .forRoutes({ path: '*', method: RequestMethod.ALL });
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
