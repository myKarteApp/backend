import { Disconnect } from '@/utils/error';
import { ErrorCode } from '@/utils/errorCode';
import { Injectable, Scope } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { SpecDatasourceProvider } from '../../spec/SpecDatasource.provider';

@Injectable({ scope: Scope.REQUEST })
export class AdminDatasourceProvider extends SpecDatasourceProvider {
  protected async accessToMainDatabase(databaseName?: string) {
    if (!databaseName) throw Disconnect(ErrorCode.Error1);
    const datasourceUrl = `mysql://root:${process.env.MYSQL_ROOT_PASSWORD}@mysql:3306/${databaseName}`;
    return new PrismaClient({
      datasourceUrl: datasourceUrl,
      errorFormat: 'pretty',
      log: ['error'],
    });
  }
}
