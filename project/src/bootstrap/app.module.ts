import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { APP_FILTER } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { DomainModule } from '@/domain/domain.module';
import { AdminDatasourceModule, MainDatasourceModule } from '@/datasource';
import { controllerModuleList } from '@/routes';
import { HttpExceptionFilter } from '@/filters/httpException.filter';
import { LoggerMiddleware } from '@/middleware/logger.middleware';

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

    // consumer
    //   .apply(csurf({ ignoreMethods: ['GET', 'HEAD', 'OPTIONS'] }))
    //   .exclude(
    //     { path: 'account/auth/verify', method: RequestMethod.GET },
    //     { path: 'account/auth/default/create', method: RequestMethod.POST },
    //     { path: 'account/auth/default/login', method: RequestMethod.POST },
    //     { path: 'docs', method: RequestMethod.ALL },
    //   )
    //   .forRoutes('*');
  }
}
