import {
  AccountInfoOfDB,
  AuthRole,
  convertIntoAccountInfoOfDB,
} from '@/shared';
import { SpecDatasourceProvider } from '@/spec/SpecDatasource.provider';
import { NotFound, Unauthorized } from '@/utils/error';
import { ErrorCode } from '@/utils/errorCode';
import { escapeSqlString } from '@/utils/sql';
import { Injectable, Scope } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';
import { AccountFields, AccountJoiner } from './utils';

@Injectable({ scope: Scope.REQUEST })
export class DomainAccountGetDetailProvider {
  public datasource: SpecDatasourceProvider;

  async getDetailByAdmin(
    authId: string,
    authRole: AuthRole,
    targetUserId: string,
    _connect?: PrismaClient,
  ): Promise<AccountInfoOfDB> {
    // NOTE: ユーザー情報があることが前提
    if (authRole !== AuthRole.admin) throw Unauthorized(ErrorCode.Error21);
    escapeSqlString(authId);
    escapeSqlString(targetUserId);

    const result = await this.connect(_connect).$queryRaw<any[]>(
      Prisma.sql([
        `
  SELECT 
    ${AccountFields.join(', ')}
  FROM
    ${AccountJoiner}
  WHERE
    auth.authId <> '${authId}'
    AND user.userID = '${targetUserId}'
    AND auth.isDeleted = false
    AND user.isDeleted = false
  ORDER BY
    user.createdAt ASC
  LIMIT 1
  ;
        `,
      ]),
    );
    if (result.length === 0) throw NotFound(ErrorCode.Error13);
    const rec = result[0];
    return convertIntoAccountInfoOfDB(rec);
  }

  protected connect(_connect: PrismaClient | undefined): PrismaClient {
    return _connect ? _connect : this.datasource.connect;
  }
}
