import { Injectable, Scope } from '@nestjs/common';
import { AuthInfo, PrismaClient, ClientInfo } from '@prisma/client';
import { SpecDatasourceProvider } from '@/spec/SpecDatasource.provider';
import { ClientInfoDto, AuthRole } from '@/shared';
import { ErrorCode } from '@/utils/errorCode';
import { Unauthorized } from '@/utils/error';
import { escapeSqlString } from '@/utils/sql';
import { ClientJoiner, clientFields } from './utils';

const authInfoKeys = [
  'authId',
  'email',
  'password',
  'authType',
  'authRole',
  'isVerify',
  'isTrial',
];

@Injectable({ scope: Scope.REQUEST })
export class DomainClientUpdateProvider {
  private readonly hashSalt = 10;
  public datasource: SpecDatasourceProvider;
  //   async getAllListByAdmin(
  //     authInfoOfAdmin: AuthInfo,
  //     _clientInfoDto: Partial<ClientInfoDto>,
  //     _connect?: PrismaClient,
  //   ): Promise<ClientInfoDto[]> {
  //     if (authInfoOfAdmin.authRole > AuthRole.admin)
  //       throw Unauthorized(ErrorCode.Error21);
  //     escapeSqlString(authInfoOfAdmin.authId);

  //     const clientInfoDto: { [key: string]: any } = Object.fromEntries(
  //       // eslint-disable-next-line @typescript-eslint/no-unused-vars
  //       Object.entries(_clientInfoDto).filter(([key, value]) => {
  //         escapeSqlString(value);
  //         return value !== undefined;
  //       }),
  //     );

  //     // const dataListForClient: string[] = [];
  //     // Object.keys(clientInfoDto).forEach((key) => {
  //     //   if (clientInfoKeys.includes(key))
  //     //     dataListForClient.push(`${key}=${clientInfoDto[key]}`);
  //     // });

  //     // const sql = `
  //     //   UPDATE
  //     //     テーブル名
  //     //   SET
  //     //     ${setList.join(', ')}
  //     //   WHERE name="山田さん" ;
  //     // `;
  //     // // this.connect(_connect).authInfo.update();
  //     // // this.connect(_connect).userInfo.update();
  //     // // this.connect(_connect).clientInfo.update({
  //     // //   where: clientInfoDto,
  //     // // });

  //     const sql = `
  //       SELECT
  //         client.clientId
  //         , ${clientFields.join(', ')}
  //       FROM
  //         ${ClientJoiner}
  //       WHERE
  //         auth.authId <> ${authInfoOfAdmin.authId}
  //         AND auth.isDeleted = false
  //         AND user.isDeleted = false
  //       ORDER BY
  //         client.createdAt ASC
  //       ;
  //     `;
  //     return this.connect(_connect).$queryRaw<ClientInfoDto[]>`${sql}`;
  //   }

  //   async getAllListByOwner(
  //     authInfoOfOwner: AuthInfo,
  //     businessOwnerId: string,
  //     _connect?: PrismaClient,
  //   ): Promise<ClientInfoDto[]> {
  //     if (authInfoOfOwner.authRole > AuthRole.owner)
  //       throw Unauthorized(ErrorCode.Error21);
  //     escapeSqlString(authInfoOfOwner.authId);
  //     escapeSqlString(businessOwnerId);

  //     const sql = `
  //       SELECT
  //         account.*
  //       FROM
  //       (
  //         SELECT
  //           client.clientId
  //           , management.businessOwnerId
  //           , ${clientFields.join(', ')}
  //         FROM
  //           ${ClientJoiner}
  //         INNER JOIN
  //           ClientManagement as management
  //         ON
  //           management.clientId = client.clientId
  //           AND management.businessOwnerId = ${businessOwnerId}
  //         WHERE
  //           auth.authId <> ${authInfoOfOwner.authId}
  //           AND management.isDeleted = false
  //         ORDER BY
  //           client.createdAt ASC
  //       ) as account
  //       GROUP BY
  //         management.businessOwnerId
  //       ;
  //     `;

  //     return this.connect(_connect).$queryRaw<ClientInfoDto[]>`${sql}`;
  //   }

  //   async getAllListByBranch(
  //     authInfoOfBranch: AuthInfo,
  //     businessBranchId: string,
  //     _connect?: PrismaClient,
  //   ): Promise<ClientInfoDto[]> {
  //     if (authInfoOfBranch.authRole > AuthRole.branch)
  //       throw Unauthorized(ErrorCode.Error21);
  //     escapeSqlString(authInfoOfBranch.authId);
  //     escapeSqlString(businessBranchId);

  //     const sql = `
  //       SELECT
  //         client.clientId
  //         , ${clientFields.join(', ')}
  //       FROM
  //         ${ClientJoiner}
  //       INNER JOIN
  //         ClientManagement as management
  //       ON
  //         management.clientId = client.clientId
  //         AND management.businessBranchId = ${businessBranchId}
  //       WHERE
  //         auth.authId <> ${authInfoOfBranch.authId}
  //         AND management.isDeleted = false
  //       ORDER BY
  //         client.createdAt ASC
  //       ;
  //     `;

  //     return this.connect(_connect).$queryRaw<ClientInfoDto[]>`${sql}`;
  //   }

  //   async getAllListByStaff(
  //     authInfoOfSuperStaff: AuthInfo,
  //     businessBranchId: string,
  //     _connect?: PrismaClient,
  //   ): Promise<ClientInfoDto[]> {
  //     /*
  //       スタッフだけでなく、自身が担当したアカウントを取得する
  //     */
  //     if (authInfoOfSuperStaff.authRole > AuthRole.staff)
  //       throw Unauthorized(ErrorCode.Error21);
  //     escapeSqlString(authInfoOfSuperStaff.authId);
  //     escapeSqlString(businessBranchId);

  //     const sql = `
  //       SELECT
  //           client.clientId
  //           , ${clientFields.join(', ')}
  //         FROM
  //           ${ClientJoiner}
  //         INNER JOIN
  //           ClientManagement as management
  //         ON
  //           management.clientId = client.clientId
  //           AND management.authId = ${authInfoOfSuperStaff.authId}
  //         WHERE
  //           auth.authId <> ${authInfoOfSuperStaff.authId}
  //           AND management.isDeleted = false
  //         ORDER BY
  //           client.createdAt ASC
  //       ;
  //     `;

  //     return this.connect(_connect).$queryRaw<ClientInfoDto[]>`${sql}`;
  //   }
  //   /*
  //     other
  //   */
  //   protected connect(_connect: PrismaClient | undefined): PrismaClient {
  //     return _connect ? _connect : this.datasource.connect;
  //   }
}

// 今のところ、clientは更新する必要ない
// Client系のコントローラから、authとuserを変更した方がいい
