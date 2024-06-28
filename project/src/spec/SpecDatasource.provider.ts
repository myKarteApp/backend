import { MyError } from '@/utils/error';
import { ErrorCode } from '@/utils/errorCode';
import { HttpStatus } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

export abstract class SpecDatasourceProvider {
  public connect: PrismaClient;

  async setConnect() {
    if (this.connect) return;
    const databaseName = process.env.MYSQL_DATABASE;
    this.connect = await this.accessToMainDatabase(databaseName);
  }

  protected async accessToMainDatabase(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    databaseName?: string,
  ): Promise<PrismaClient> {
    throw new MyError({
      code: HttpStatus.NOT_IMPLEMENTED,
      status: 'Not Implemented',
      message: 'Not Implemented',
      errorCode: ErrorCode.Error18,
    });
  }

  public async transact<T>(
    // TODO: 必要であれば、事前事後処理を書く。
    callback: (connect: PrismaClient) => Promise<T>,
  ): Promise<T> {
    try {
      console.log('== connect: start ===');
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
        errorCode: ErrorCode.Error17,
      });
    } finally {
      console.log('== connect: end ===');
      await this.connect.$disconnect();
    }
  }
}
