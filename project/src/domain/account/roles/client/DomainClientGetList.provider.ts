import { Injectable, Scope } from '@nestjs/common';
import { AuthInfo, PrismaClient } from '@prisma/client';
import { SpecDatasourceProvider } from '@/spec/SpecDatasource.provider';
import { AccountInfoDto, AuthRole } from '@/shared';
import { ErrorCode } from '@/utils/errorCode';
import { Unauthorized } from '@/utils/error';
import { escapeSqlString } from '@/utils/sql';

@Injectable({ scope: Scope.REQUEST })
export class DomainClientGetListProvider {
  private readonly hashSalt = 10;
  public datasource: SpecDatasourceProvider;

  async getAllListByAdmin(
    authInfoOfAdmin: AuthInfo,
    _connect?: PrismaClient,
  ): Promise<AccountInfoDto[]> {
    if (authInfoOfAdmin.authRole > AuthRole.admin)
      throw Unauthorized(ErrorCode.Error21);
    escapeSqlString(authInfoOfAdmin.authId);

    const sql = `
      SELECT 
        auth.authId
        , auth.email
        , auth.authType
        , auth.authRole
        , auth.identityConfirmed
        , auth.isTrial
        , user.userId
        , user.birthDay
        , user.sex
        , user.familyName
        , user.givenName
        , user.tel
        , user.profession
        , user.createdAt
      FROM
        AuthInfo as auth
      INNER JOIN
        UserInfo as user
      ON
        auth.authId = user.authId
      WHERE
        auth.authId <> ${authInfoOfAdmin.authId}
        AND auth.isDeleted = false
        AND user.isDeleted = false
      ORDER BY
        user.createdAt ASC
      ;
    `;
    return this.connect(_connect).$queryRaw<AccountInfoDto[]>`${sql}`;
  }

  async getAllListByOwner(
    authInfoOfOwner: AuthInfo,
    businessOwnerId: string,
    _connect?: PrismaClient,
  ): Promise<AccountInfoDto[]> {
    if (authInfoOfOwner.authRole > AuthRole.owner)
      throw Unauthorized(ErrorCode.Error21);
    escapeSqlString(authInfoOfOwner.authId);
    escapeSqlString(businessOwnerId);

    const sql = `
      SELECT
        account.*
      FROM
      ( 
        SELECT 
            auth.authId
            , auth.email
            , auth.authType
            , auth.authRole
            , auth.identityConfirmed
            , auth.isTrial
            , user.userId
            , user.birthDay
            , user.sex
            , user.familyName
            , user.givenName
            , user.tel
            , user.profession
            , user.createdAt
            , management.businessOwnerId
          FROM
            AuthInfo as auth
          INNER JOIN
            UserInfo as user
          ON
            auth.authId = user.authId
          INNER JOIN
            ClientInfo as client
          ON
            client.authId = auth.authId
          INNER JOIN
            ClientManagement
          ON
            management.clientId = client.clientId
            AND management.businessOwnerId = ${businessOwnerId}
          WHERE
            auth.authId <> ${authInfoOfOwner.authId}
            AND auth.isDeleted = false
            AND user.isDeleted = false
          ORDER BY
            user.createdAt ASC
      ) as account
      GROUP BY
        management.businessOwnerId
      ;
    `;

    return this.connect(_connect).$queryRaw<AccountInfoDto[]>`${sql}`;
  }

  async getAllListByBranch(
    authInfoOfBranch: AuthInfo,
    businessBranchId: string,
    _connect?: PrismaClient,
  ): Promise<AccountInfoDto[]> {
    if (authInfoOfBranch.authRole > AuthRole.branch)
      throw Unauthorized(ErrorCode.Error21);
    escapeSqlString(authInfoOfBranch.authId);
    escapeSqlString(businessBranchId);

    const sql = `
      SELECT 
          auth.authId
          , auth.email
          , auth.authType
          , auth.authRole
          , auth.identityConfirmed
          , auth.isTrial
          , user.userId
          , user.birthDay
          , user.sex
          , user.familyName
          , user.givenName
          , user.tel
          , user.profession
          , user.createdAt
        FROM
          AuthInfo as auth
        INNER JOIN
          UserInfo as user
        ON
          auth.authId = user.authId
        INNER JOIN
          ClientInfo as client
        ON
          client.authId = auth.authId
        INNER JOIN
          ClientManagement
        ON
          management.clientId = client.clientId
          AND management.businessBranchId = ${businessBranchId}
        WHERE
          auth.authId <> ${authInfoOfBranch.authId}
          AND auth.isDeleted = false
          AND user.isDeleted = false
        ORDER BY
          user.createdAt ASC
      ;
    `;

    return this.connect(_connect).$queryRaw<AccountInfoDto[]>`${sql}`;
  }

  async getAllListByStaff(
    authInfoOfSuperStaff: AuthInfo,
    businessBranchId: string,
    _connect?: PrismaClient,
  ): Promise<AccountInfoDto[]> {
    /*
      スタッフだけでなく、自身が担当したアカウントを取得する
    */
    if (authInfoOfSuperStaff.authRole > AuthRole.staff)
      throw Unauthorized(ErrorCode.Error21);
    escapeSqlString(authInfoOfSuperStaff.authId);
    escapeSqlString(businessBranchId);

    const sql = `
      SELECT 
          auth.authId
          , auth.email
          , auth.authType
          , auth.authRole
          , auth.identityConfirmed
          , auth.isTrial
          , user.userId
          , user.birthDay
          , user.sex
          , user.familyName
          , user.givenName
          , user.tel
          , user.profession
          , user.createdAt
        FROM
          AuthInfo as auth
        INNER JOIN
          UserInfo as user
        ON
          auth.authId = user.authId
        INNER JOIN
          ClientInfo as client
        ON
          client.authId = auth.authId
        INNER JOIN
          ClientManagement
        ON
          management.clientId = client.clientId
          AND management.authId = ${authInfoOfSuperStaff.authId}
        WHERE
          auth.authId <> ${authInfoOfSuperStaff.authId}
          AND auth.isDeleted = false
          AND user.isDeleted = false
        ORDER BY
          user.createdAt ASC
      ;
    `;

    return this.connect(_connect).$queryRaw<AccountInfoDto[]>`${sql}`;
  }
  /*
    other
  */
  protected connect(_connect: PrismaClient | undefined): PrismaClient {
    return _connect ? _connect : this.datasource.connect;
  }
}
