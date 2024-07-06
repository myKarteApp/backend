import {
  AccountInfoOfDB,
  AuthRole,
  convertIntoAccountInfoOfDB,
} from '@/shared';
import { SpecDatasourceProvider } from '@/spec/SpecDatasource.provider';
import { Unauthorized } from '@/utils/error';
import { ErrorCode } from '@/utils/errorCode';
import { escapeSqlString } from '@/utils/sql';
import { Injectable, Scope } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';
import { AccountFields, AccountJoiner } from './utils';

@Injectable({ scope: Scope.REQUEST })
export class DomainAccountGetListProvider {
  public datasource: SpecDatasourceProvider;

  async getAllListByAdmin(
    authId: string,
    authRole: AuthRole,
    _connect?: PrismaClient,
  ): Promise<AccountInfoOfDB[]> {
    if (authRole !== AuthRole.admin) throw Unauthorized(ErrorCode.Error48);
    escapeSqlString(authId);

    const result = await this.connect(_connect).$queryRaw<any[]>(
      Prisma.sql([
        `
  SELECT 
    ${AccountFields.join(', ')}
  FROM 
    ${AccountJoiner}
  WHERE
    auth.authId <> "${authId}"
    AND auth.isDeleted = false
    AND user.isDeleted = false
  ORDER BY
    user.createdAt ASC
;`,
      ]),
    );

    return result.map((rec) => {
      return convertIntoAccountInfoOfDB(rec);
    });
  }

  protected connect(_connect: PrismaClient | undefined): PrismaClient {
    return _connect ? _connect : this.datasource.connect;
  }
}
