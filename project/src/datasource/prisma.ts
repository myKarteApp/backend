import { PrismaClient } from '@prisma/client';

export class MysqlPrismaClient {
  private async getPrismaClient(databaseName?: string): Promise<PrismaClient> {
    if (!databaseName) throw new Error('データベース名を指定してください');
    const datasourceUrl = `mysql://${process.env.MYSQL_USER}:${process.env.MYSQL_PASSWORD}@mysql:3306/${databaseName}`;
    return new PrismaClient({
      datasourceUrl: datasourceUrl,
      errorFormat: 'pretty',
    });
  }

  public async accessToMainDatabase(): Promise<PrismaClient> {
    const databaseName = process.env.MYSQL_DATABASE;
    return this.getPrismaClient(databaseName);
  }
}
