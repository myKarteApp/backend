import { Disconnect } from '@/utils/error';
import { ErrorCode } from '@/utils/errorCode';
import { PrismaClient } from '@prisma/client';

export class MysqlPrismaClient {
  private async getPrismaClient(databaseName?: string): Promise<PrismaClient> {
    if (!databaseName) throw Disconnect(ErrorCode.Error3);
    const datasourceUrl = `mysql://${process.env.MYSQL_USER}:${process.env.MYSQL_PASSWORD}@mysql:3306/${databaseName}`;
    return new PrismaClient({
      datasourceUrl: datasourceUrl,
      errorFormat: 'pretty',
      log: ['query', 'info', 'warn'],
    });
  }

  public async accessToMainDatabase(): Promise<PrismaClient> {
    const databaseName = process.env.MYSQL_DATABASE;
    return this.getPrismaClient(databaseName);
  }
}
