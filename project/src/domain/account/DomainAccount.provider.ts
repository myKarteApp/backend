import { AccountInfoOfDB, convertIntoAccountInfoOfDB } from '@/shared';
import { SpecDatasourceProvider } from '@/spec/SpecDatasource.provider';
import { BadRequest } from '@/utils/error';
import { ErrorCode } from '@/utils/errorCode';
import { escapeSqlString } from '@/utils/sql';
import { Injectable, Scope } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';
import { AccountFields, AccountJoiner } from './utils';

@Injectable({ scope: Scope.REQUEST })
export class DomainAccountProvider {
  public datasource: SpecDatasourceProvider;

  async getAccountInfoByUserId(
    userId: string,
    _connect?: PrismaClient,
  ): Promise<AccountInfoOfDB> {
    escapeSqlString(userId);

    const result = await this.connect(_connect).$queryRaw<any[]>(
      Prisma.sql([
        `
  SELECT 
    ${AccountFields.join(', ')}
  FROM 
    ${AccountJoiner}
  WHERE
    user.userId = "${userId}"
    AND auth.isDeleted = false
    AND user.isDeleted = false
        `,
      ]),
    );

    if (result.length !== 1) throw BadRequest(ErrorCode.Error45);
    const rec = result[0];
    return convertIntoAccountInfoOfDB(rec);
  }

  protected connect(_connect: PrismaClient | undefined): PrismaClient {
    return _connect ? _connect : this.datasource.connect;
  }
}
