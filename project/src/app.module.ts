import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MainDatasourceModule } from './datasource/mainDatasource.module';
import { moduleList } from './routes';
import { APP_FILTER } from '@nestjs/core';
import { HttpExceptionFilter } from './filters/httpException.filter';
import { LoggerMiddleware } from './middleware/logger.middleware';

@Module({
  imports: [MainDatasourceModule.forRoot(), ...moduleList],
  exports: [MainDatasourceModule],
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
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
