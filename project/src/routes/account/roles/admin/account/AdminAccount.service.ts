import { AdminDatasourceProvider } from '@/datasource';
import { DomainAccountProvider } from '@/domain/account/DomainAccount.provider';
import { DomainAccountGetDetailProvider } from '@/domain/account/DomainAccountGetDetail.provider';
import { DomainAccountGetListProvider } from '@/domain/account/DomainAccountGetList.provider';
import { DomainAccountGetListByIdListProvider } from '@/domain/account/DomainAccountGetListByIdList.provider';
import { DomainAuthDefaultProvider } from '@/domain/account/auth/default/DomainAuthDefault.provider';
import { DomainUserProvider } from '@/domain/account/user/DomainUser.provider';
import { AuthCookieProvider } from '@/domain/http';
import {
  AccountInfoOfDB,
  AuthRole,
  CreateAccountInfoDto,
  UserIdListDto,
  getEnumValue,
} from '@/shared';
import { BadRequest, NotFound } from '@/utils/error';
import { ErrorCode } from '@/utils/errorCode';
import { Injectable, Scope } from '@nestjs/common';
import { AuthType, PrismaClient } from '@prisma/client';
import { Request as ExpressRequest } from 'express';
import { v4 } from 'uuid';

@Injectable({ scope: Scope.REQUEST })
export class AdminAccountService {
  constructor(
    private readonly datasource: AdminDatasourceProvider,
    // 認証用
    private readonly domainAccountProvider: DomainAccountProvider,
    private readonly authCookieProvider: AuthCookieProvider,
    // create, update
    private readonly domainAuthDefaultProvider: DomainAuthDefaultProvider,
    private readonly domainUserProvider: DomainUserProvider,
    // read
    private readonly domainAccountGetListProvider: DomainAccountGetListProvider,
    private readonly domainAccountGetDetailProvider: DomainAccountGetDetailProvider,
    private readonly domainAccountGetListByIdListProvider: DomainAccountGetListByIdListProvider,
  ) {}
  /* ============================
    認証用
  ============================ */
  public async validateAuth(
    request: ExpressRequest,
    userId: string,
    _connect?: PrismaClient,
  ): Promise<AccountInfoOfDB> {
    // セッションは存在するか？
    const sessionId = request.cookies[this.authCookieProvider.sessionKey];
    if (!sessionId) throw NotFound(ErrorCode.Error12);
    // アカウントがadminであるか？
    const myAccount: AccountInfoOfDB =
      await this.domainAccountProvider.getAccountInfoByUserId(userId, _connect);
    if (myAccount.authRole !== AuthRole.admin)
      throw BadRequest(ErrorCode.Error46);
    // ログイン用セッションは有効か？
    await this.authCookieProvider.validateLoginSession(
      myAccount.authId,
      sessionId,
      _connect,
    );
    return myAccount;
  }

  /* ============================
    以下、メイン処理
  ============================ */

  async create(dto: CreateAccountInfoDto, _connect?: PrismaClient) {
    const newAuthId = v4();
    // AuthInfoを作る
    await this.domainAuthDefaultProvider.createAuthInfo(
      {
        authId: newAuthId,
        email: dto.email,
        password: dto.password,
        authType: getEnumValue(AuthType, dto.authType),
        authRole: dto.authRole,
        isVerify: dto.isVerify,
        isTrial: dto.isTrial,
      },
      _connect,
    );
    // UserInfoを作る
    const newUserId = v4();
    await this.domainUserProvider.createUserInfo(
      {
        userId: newUserId,
        authId: newAuthId,
        birthDay: dto.user.birthDay,
        sex: dto.user.sex,
        gender: dto.user.gender,
        familyName: dto.user.familyName,
        givenName: dto.user.givenName,
        address: dto.user.address,
        tel: dto.user.tel,
        profession: dto.user.profession,
      },
      _connect,
    );
  }

  async getDetail(
    authId: string,
    authRole: AuthRole,
    targetUserId: string,
    _connect?: PrismaClient,
  ): Promise<AccountInfoOfDB> {
    return this.domainAccountGetDetailProvider.getDetailByAdmin(
      authId,
      authRole,
      targetUserId,
      _connect,
    );
  }

  async getAllList(
    authId: string,
    authRole: AuthRole,
    _connect?: PrismaClient,
  ): Promise<AccountInfoOfDB[]> {
    return this.domainAccountGetListProvider.getAllListByAdmin(
      authId,
      authRole,
      _connect,
    );
  }

  async update(
    authId: string,
    authRole: AuthRole,
    targetUserId: string,
    dto: Partial<CreateAccountInfoDto>,
    _connect?: PrismaClient,
  ): Promise<void> {
    // authIdを取得する
    // NOTE: 存在しなければエラーが発生している
    const targetAccount: AccountInfoOfDB =
      await this.domainAccountGetDetailProvider.getDetailByAdmin(
        authId,
        authRole,
        targetUserId,
        _connect,
      );
    const { user } = dto;
    const auth = { ...dto };
    // 認証情報を更新する
    if (user) delete auth['user'];
    await this.domainAuthDefaultProvider.update(
      targetAccount.authId,
      auth,
      _connect,
    );
    // ユーザー情報を更新する
    if (user) {
      await this.domainUserProvider.update(
        targetAccount.authId,
        targetUserId,
        user,
        _connect,
      );
    }
  }

  async delete(
    authId: string,
    authRole: AuthRole,
    targetUserId: string,
    _connect?: PrismaClient,
  ): Promise<void> {
    // authIdを取得する
    // NOTE: 存在しなければエラーが発生している
    const targetAccount: AccountInfoOfDB =
      await this.domainAccountGetDetailProvider.getDetailByAdmin(
        authId,
        authRole,
        targetUserId,
        _connect,
      );
    // 認証情報を更新する
    await this.domainAuthDefaultProvider.delete(
      [targetAccount.authId],
      _connect,
    );
    // ユーザー情報を更新する
    if (targetAccount.user) {
      await this.domainUserProvider.delete(
        [targetAccount.user.userId],
        _connect,
      );
    }
  }

  async bulkDelete(
    authId: string,
    authRole: AuthRole,
    dto: UserIdListDto,
    _connect?: PrismaClient,
  ): Promise<void> {
    const targetAccount: AccountInfoOfDB[] =
      await this.domainAccountGetListByIdListProvider.getListByAdmin(
        authId,
        authRole,
        dto,
        _connect,
      );
    const authIdList: string[] = targetAccount.map((rec) => {
      return rec.authId;
    });

    console.log(targetAccount);
    // 認証情報を更新する
    await this.domainAuthDefaultProvider.delete(authIdList, _connect);
    // ユーザー情報を更新する
    const userIdList: string[] = [];
    targetAccount.forEach((rec) => {
      if (rec.user) userIdList.push(rec.user.userId);
    });
    if (userIdList.length > 0) {
      await this.domainUserProvider.delete(userIdList, _connect);
    }
  }
  /* ============================
    以下、その他
  ============================ */

  protected connect(_connect: PrismaClient | undefined): PrismaClient {
    return _connect ? _connect : this.datasource.connect;
  }
}
