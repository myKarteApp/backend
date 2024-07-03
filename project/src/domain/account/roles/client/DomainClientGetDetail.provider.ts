import { Injectable, Scope } from '@nestjs/common';
import { AuthInfo, PrismaClient } from '@prisma/client';
import { SpecDatasourceProvider } from '@/spec/SpecDatasource.provider';
import { ClientInfoDto, AuthRole } from '@/shared';
import { ErrorCode } from '@/utils/errorCode';
import { Unauthorized } from '@/utils/error';
import { escapeSqlString } from '@/utils/sql';
import { ClientJoiner, clientFields } from './utils';

@Injectable({ scope: Scope.REQUEST })
export class DomainClientGetDetailProvider {
  private readonly hashSalt = 10;
  public datasource: SpecDatasourceProvider;

  async getDetailByAdmin(
    authInfoOfAdmin: AuthInfo,
    clientId: string,
    _connect?: PrismaClient,
  ): Promise<ClientInfoDto | null> {
    if (authInfoOfAdmin.authRole > AuthRole.admin)
      throw Unauthorized(ErrorCode.Error21);
    escapeSqlString(authInfoOfAdmin.authId);
    escapeSqlString(clientId);

    const sql = `
      SELECT 
        client.clientId
        , ${clientFields.join(', ')}
      FROM
        ${ClientJoiner}
      WHERE
        client.clientId = ${clientId}
      ORDER BY
        client.createdAt ASC
      ;
    `;
    const clientList = await this.connect(_connect).$queryRaw<
      ClientInfoDto[]
    >`${sql}`;

    if (Object.keys(clientList).length != 1) return null;
    return clientList[0];
  }

  async getDetailByOwner(
    authInfoOfOwner: AuthInfo,
    businessOwnerId: string,
    clientId: string,
    _connect?: PrismaClient,
  ): Promise<ClientInfoDto | null> {
    if (authInfoOfOwner.authRole > AuthRole.owner)
      throw Unauthorized(ErrorCode.Error21);
    escapeSqlString(authInfoOfOwner.authId);
    escapeSqlString(businessOwnerId);
    escapeSqlString(clientId);

    const sql = `
      SELECT
        groupClient.*
      FROM
      ( 
        SELECT 
          client.clientId
          , management.businessOwnerId
          , ${clientFields.join(', ')}
        FROM
          ${ClientJoiner}
        INNER JOIN
          ClientManagement as management
        ON
          management.clientId = client.clientId
          AND management.businessOwnerId = ${businessOwnerId}
        WHERE
          auth.authId <> ${authInfoOfOwner.authId}
          AND management.isDeleted = false
          AND client.clientId = ${clientId}
        ORDER BY
          client.createdAt ASC
      ) as groupClient
      GROUP BY
        management.businessOwnerId
      ;
    `;
    const clientList = await this.connect(_connect).$queryRaw<
      ClientInfoDto[]
    >`${sql}`;

    if (Object.keys(clientList).length != 1) return null;
    return clientList[0];
  }

  async getDetailByBranch(
    authInfoOfBranch: AuthInfo,
    businessBranchId: string,
    clientId: string,
    _connect?: PrismaClient,
  ): Promise<ClientInfoDto | null> {
    if (authInfoOfBranch.authRole > AuthRole.branch)
      throw Unauthorized(ErrorCode.Error21);
    escapeSqlString(authInfoOfBranch.authId);
    escapeSqlString(businessBranchId);
    escapeSqlString(clientId);

    const sql = `
      SELECT 
        client.clientId
        , ${clientFields.join(', ')}
      FROM
        ${ClientJoiner}
      INNER JOIN
        ClientManagement as management
      ON
        management.clientId = client.clientId
        AND management.businessBranchId = ${businessBranchId}
      WHERE
        auth.authId <> ${authInfoOfBranch.authId}
        AND management.isDeleted = false
        AND client.clientId = ${clientId}
      ORDER BY
        client.createdAt ASC
      ;
    `;

    const clientList = await this.connect(_connect).$queryRaw<
      ClientInfoDto[]
    >`${sql}`;

    if (Object.keys(clientList).length != 1) return null;
    return clientList[0];
  }

  async getDetailByStaff(
    authInfoOfSuperStaff: AuthInfo,
    businessBranchId: string,
    clientId: string,
    _connect?: PrismaClient,
  ): Promise<ClientInfoDto | null> {
    /*
      スタッフだけでなく、自身が担当したアカウントを取得する
    */
    if (authInfoOfSuperStaff.authRole > AuthRole.staff)
      throw Unauthorized(ErrorCode.Error21);
    escapeSqlString(authInfoOfSuperStaff.authId);
    escapeSqlString(businessBranchId);
    escapeSqlString(clientId);

    const sql = `
      SELECT 
          client.clientId
          , ${clientFields.join(', ')}
        FROM
          ${ClientJoiner}
        INNER JOIN
          ClientManagement as management
        ON
          management.clientId = client.clientId
          AND management.authId = ${authInfoOfSuperStaff.authId}
        WHERE
          auth.authId <> ${authInfoOfSuperStaff.authId}
          AND management.isDeleted = false
          AND client.clientId = ${clientId}
        ORDER BY
          client.createdAt ASC
      ;
    `;
    const clientList = await this.connect(_connect).$queryRaw<
      ClientInfoDto[]
    >`${sql}`;

    if (Object.keys(clientList).length != 1) return null;
    return clientList[0];
  }
  /*
    other
  */
  protected connect(_connect: PrismaClient | undefined): PrismaClient {
    return _connect ? _connect : this.datasource.connect;
  }
}
