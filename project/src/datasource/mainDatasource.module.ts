import { Module, DynamicModule } from '@nestjs/common';
import { MainDatasourceProvider } from './mainDatasource.provider';

@Module({
  providers: [MainDatasourceProvider],
  exports: [MainDatasourceProvider],
})
export class MainDatasourceModule {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  static forRoot(): DynamicModule {
    return {
      module: MainDatasourceModule,
      providers: [MainDatasourceProvider],
      exports: [MainDatasourceProvider],
    };
  }
}
