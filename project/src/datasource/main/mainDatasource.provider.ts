import { Disconnect } from '@/utils/error';
import { ErrorCode } from '@/utils/errorCode';
import { Injectable, Scope } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { SpecDatasourceProvider } from '../../spec/SpecDatasource.provider';

@Injectable({ scope: Scope.REQUEST })
export class MainDatasourceProvider extends SpecDatasourceProvider {
  protected async accessToMainDatabase(databaseName?: string) {
    if (!databaseName) throw Disconnect(ErrorCode.Error2);
    const datasourceUrl = `mysql://${process.env.MYSQL_USER}:${process.env.MYSQL_PASSWORD}@mysql:3306/${databaseName}`;
    return new PrismaClient({
      datasourceUrl: datasourceUrl,
      errorFormat: 'pretty',
      log: ['error'],
    });
  }
}
