import {
  AccountInfoOfDB,
  AuthRole,
  UserIdListDto,
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
export class DomainAccountGetListByIdListProvider {
  public datasource: SpecDatasourceProvider;

  async getListByAdmin(
    authId: string,
    authRole: AuthRole,
    dto: UserIdListDto,
    _connect?: PrismaClient,
  ): Promise<AccountInfoOfDB[]> {
    if (authRole !== AuthRole.admin) throw Unauthorized(ErrorCode.Error49);
    escapeSqlString(authId);
    const userIdList: string[] = dto.userIdList.map((userId) => {
      escapeSqlString(userId);
      return `'${userId}'`;
    });
    const whereInUserIdList = userIdList.join(', ');

    const result = await this.connect(_connect).$queryRaw<any[]>(
      Prisma.sql([
        `
  SELECT 
    ${AccountFields.join(', ')}
  FROM 
    ${AccountJoiner}
  WHERE
    auth.authId <> "${authId}"
    AND user.userId in (${whereInUserIdList})
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
