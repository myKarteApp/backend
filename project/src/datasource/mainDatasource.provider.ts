import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class MainDatasourceProvider {
  public connect: PrismaClient;

  async onModuleInit() {
    const databaseName = process.env.MYSQL_DATABASE;
    this.connect = await this.accessToMainDatabase(databaseName);
  }
  protected async accessToMainDatabase(databaseName?: string) {
    if (!databaseName) throw new Error('データベース名を指定してください');
    const datasourceUrl = `mysql://${process.env.MYSQL_USER}:${process.env.MYSQL_PASSWORD}@mysql:3306/${databaseName}`;
    return new PrismaClient({
      datasourceUrl: datasourceUrl,
      errorFormat: 'pretty',
    });
  }
}
