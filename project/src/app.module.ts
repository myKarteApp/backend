import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { controllerModuleList } from './routes';
import { APP_FILTER } from '@nestjs/core';
import { HttpExceptionFilter } from './filters/httpException.filter';
import { LoggerMiddleware } from './middleware/logger.middleware';
import * as cookieParser from 'cookie-parser';
import { AdminDatasourceModule, MainDatasourceModule } from './datasource';
import { DomainModule } from './domain/domain.module';
import * as csurf from 'csurf';

const moduleList = [
  DomainModule,
  // admin用
  AdminDatasourceModule,
  // その他ユーザー用
  MainDatasourceModule,
];
@Module({
  imports: [...moduleList, ...controllerModuleList],
  exports: moduleList,
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

    consumer
      .apply(csurf({ ignoreMethods: ['GET', 'HEAD', 'OPTIONS'] }))
      .exclude(
        { path: 'account/auth/verify', method: RequestMethod.GET },
        { path: 'account/auth/default/create', method: RequestMethod.POST },
        { path: 'account/auth/default/login', method: RequestMethod.POST },
      )
      .forRoutes('*');
  }
}
