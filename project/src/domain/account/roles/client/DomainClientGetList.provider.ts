import { Injectable, Scope } from '@nestjs/common';
import { AuthInfo, PrismaClient } from '@prisma/client';
import { SpecDatasourceProvider } from '@/spec/SpecDatasource.provider';
import { ClientInfoDto, AuthRole } from '@/shared';
import { ErrorCode } from '@/utils/errorCode';
import { Unauthorized } from '@/utils/error';
import { escapeSqlString } from '@/utils/sql';
import { ClientJoiner, clientFields } from './utils';

@Injectable({ scope: Scope.REQUEST })
export class DomainClientGetListProvider {
  public datasource: SpecDatasourceProvider;

  async getAllListByAdmin(
    authId: string,
    authRole: AuthRole,
    _connect?: PrismaClient,
  ): Promise<ClientInfoDto[]> {
    if (authRole > AuthRole.admin) throw Unauthorized(ErrorCode.Error54);
    escapeSqlString(authId);

    const sql = `
      SELECT 
        client.clientId
        , ${clientFields.join(', ')}
      FROM
        ${ClientJoiner}
      WHERE
        auth.authId <> ${authId} 
        AND auth.isDeleted = false
        AND user.isDeleted = false
      ORDER BY
        client.createdAt ASC
      ;
    `;
    return this.connect(_connect).$queryRaw<ClientInfoDto[]>`${sql}`;
  }

  // async getAllListByOwner(
  //   authInfoOfOwner: AuthInfo,
  //   businessOwnerId: string,
  //   _connect?: PrismaClient,
  // ): Promise<ClientInfoDto[]> {
  //   if (authInfoOfOwner.authRole > AuthRole.owner)
  //     throw Unauthorized(ErrorCode.Error21);
  //   escapeSqlString(authInfoOfOwner.authId);
  //   escapeSqlString(businessOwnerId);

  //   const sql = `
  //     SELECT
  //       account.*
  //     FROM
  //     (
  //       SELECT
  //         client.clientId
  //         , management.businessOwnerId
  //         , ${clientFields.join(', ')}
  //       FROM
  //         ${ClientJoiner}
  //       INNER JOIN
  //         ClientManagement as management
  //       ON
  //         management.clientId = client.clientId
  //         AND management.businessOwnerId = ${businessOwnerId}
  //       WHERE
  //         auth.authId <> ${authInfoOfOwner.authId}
  //         AND management.isDeleted = false
  //       ORDER BY
  //         client.createdAt ASC
  //     ) as account
  //     GROUP BY
  //       management.businessOwnerId
  //     ;
  //   `;

  //   return this.connect(_connect).$queryRaw<ClientInfoDto[]>`${sql}`;
  // }

  // async getAllListByBranch(
  //   authInfoOfBranch: AuthInfo,
  //   businessBranchId: string,
  //   _connect?: PrismaClient,
  // ): Promise<ClientInfoDto[]> {
  //   if (authInfoOfBranch.authRole > AuthRole.branch)
  //     throw Unauthorized(ErrorCode.Error21);
  //   escapeSqlString(authInfoOfBranch.authId);
  //   escapeSqlString(businessBranchId);

  //   const sql = `
  //     SELECT
  //       client.clientId
  //       , ${clientFields.join(', ')}
  //     FROM
  //       ${ClientJoiner}
  //     INNER JOIN
  //       ClientManagement as management
  //     ON
  //       management.clientId = client.clientId
  //       AND management.businessBranchId = ${businessBranchId}
  //     WHERE
  //       auth.authId <> ${authInfoOfBranch.authId}
  //       AND management.isDeleted = false
  //     ORDER BY
  //       client.createdAt ASC
  //     ;
  //   `;

  //   return this.connect(_connect).$queryRaw<ClientInfoDto[]>`${sql}`;
  // }

  // async getAllListByStaff(
  //   authInfoOfSuperStaff: AuthInfo,
  //   businessBranchId: string,
  //   _connect?: PrismaClient,
  // ): Promise<ClientInfoDto[]> {
  //   /*
  //     スタッフだけでなく、自身が担当したアカウントを取得する
  //   */
  //   if (authInfoOfSuperStaff.authRole > AuthRole.staff)
  //     throw Unauthorized(ErrorCode.Error21);
  //   escapeSqlString(authInfoOfSuperStaff.authId);
  //   escapeSqlString(businessBranchId);

  //   const sql = `
  //     SELECT
  //         client.clientId
  //         , ${clientFields.join(', ')}
  //       FROM
  //         ${ClientJoiner}
  //       INNER JOIN
  //         ClientManagement as management
  //       ON
  //         management.clientId = client.clientId
  //         AND management.authId = ${authInfoOfSuperStaff.authId}
  //       WHERE
  //         auth.authId <> ${authInfoOfSuperStaff.authId}
  //         AND management.isDeleted = false
  //       ORDER BY
  //         client.createdAt ASC
  //     ;
  //   `;

  //   return this.connect(_connect).$queryRaw<ClientInfoDto[]>`${sql}`;
  // }
  /*
    other
  */
  protected connect(_connect: PrismaClient | undefined): PrismaClient {
    return _connect ? _connect : this.datasource.connect;
  }
}
