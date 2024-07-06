import { AccountInfoFromDB, AuthRole, SexType, getEnumValue } from '@/shared';
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
  ): Promise<AccountInfoFromDB[]> {
    if (authRole !== AuthRole.admin) throw Unauthorized(ErrorCode.Error21);
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
      return {
        authId: rec.authId,
        authRole: rec.authRole,
        email: rec.email,
        authType: rec.authType,
        isVerify: rec.isVerify,
        isTrial: rec.isTrial,
        user: {
          userId: rec.userId,
          birthDay: rec.birthDay,
          sex: getEnumValue(SexType, rec.sex),
          gender: rec.gender,
          familyName: rec.familyName,
          givenName: rec.givenName,
          tel: rec.tel,
          profession: rec.profession,
          address: rec.address,
          createdAt: rec.createdAt,
        },
      };
    });
  }

  protected connect(_connect: PrismaClient | undefined): PrismaClient {
    return _connect ? _connect : this.datasource.connect;
  }
}
