import { Disconnect, MyError } from '@/utils/error';
import { ErrorCode } from '@/utils/errorCode';
import { HttpStatus, Injectable, Scope } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable({ scope: Scope.REQUEST })
export class MainDatasourceProvider {
  public connect: PrismaClient;

  async setConnect() {
    if (this.connect) return;
    const databaseName = process.env.MYSQL_DATABASE;
    this.connect = await this.accessToMainDatabase(databaseName);
  }

  protected async accessToMainDatabase(databaseName?: string) {
    if (!databaseName) throw Disconnect('Error11');
    const datasourceUrl = `mysql://${process.env.MYSQL_USER}:${process.env.MYSQL_PASSWORD}@mysql:3306/${databaseName}`;
    return new PrismaClient({
      datasourceUrl: datasourceUrl,
      errorFormat: 'pretty',
    });
  }

  public async transact<T>(
    // TODO: 必要であれば、事前事後処理を書く。
    callback: (connect: PrismaClient) => Promise<T>,
  ): Promise<T> {
    try {
      await this.setConnect();
      return this.connect.$transaction(async (connect: PrismaClient) => {
        return await callback(connect);
      });
    } catch (error) {
      console.log(error);
      if (error instanceof MyError) throw error;
      throw new MyError({
        code: HttpStatus.EXPECTATION_FAILED,
        status: 'Unexpected',
        message: 'Unexpected',
        innerError: error,
        errorCode: ErrorCode['Error1'],
      });
    } finally {
      await this.connect.$disconnect();
    }
  }
}
