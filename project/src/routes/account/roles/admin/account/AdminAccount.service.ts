import { AdminDatasourceProvider } from '@/datasource';
import { DomainAccountProvider } from '@/domain/account/DomainAccount.provider';
import { DomainAccountGetDetailProvider } from '@/domain/account/DomainAccountGetDetail.provider';
import { DomainAccountGetListProvider } from '@/domain/account/DomainAccountGetList.provider';
import { DomainAuthDefaultProvider } from '@/domain/account/auth/default/DomainAuthDefault.provider';
import { DomainUserProvider } from '@/domain/account/user/DomainUser.provider';
import { AuthCookieProvider } from '@/domain/http';
import {
  AccountInfoFromDB,
  AuthRole,
  CreateAccountInfoDto,
  getEnumValue,
} from '@/shared';
import { BadRequest, NotFound } from '@/utils/error';
import { ErrorCode } from '@/utils/errorCode';
import { Injectable, Scope } from '@nestjs/common';
import { AuthType, PrismaClient } from '@prisma/client';
import {
  Request as ExpressRequest,
  Response as ExpressResponse,
} from 'express';
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
  ) {}
  /* ============================
    認証用
  ============================ */
  public async validateAuth(
    request: ExpressRequest,
    userId: string,
    _connect?: PrismaClient,
  ): Promise<AccountInfoFromDB> {
    // セッションは存在するか？
    const sessionId = request.cookies[this.authCookieProvider.sessionKey];
    if (!sessionId) throw NotFound(ErrorCode.Error12);
    // アカウントがadminであるか？
    const myAccount: AccountInfoFromDB =
      await this.domainAccountProvider.getAccountInfoByUserId(userId, _connect);
    if (myAccount.authRole !== AuthRole.admin)
      throw BadRequest(ErrorCode.Error1);
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

  async update(
    authId: string,
    authRole: AuthRole,
    targetUserId: string,
    dto: Partial<CreateAccountInfoDto>,
    _connect?: PrismaClient,
  ): Promise<any> {
    // authIdを取得する
    // NOTE: 存在しなければエラーが発生している
    const targetAccount: AccountInfoFromDB =
      await this.domainAccountGetDetailProvider.getDetailByAdmin(
        authId,
        authRole,
        targetUserId,
        _connect,
      );
    const { user } = dto;
    // 認証情報を更新する
    const authDto = { ...dto };
    if (user) delete authDto['user'];
    await this.domainAuthDefaultProvider.update(
      targetAccount.authId,
      dto,
      _connect,
    );
    // ユーザー情報を更新する
    if (user) {
      const targetUserId = targetAccount.user.userId;
      if (!targetUserId) throw BadRequest(ErrorCode.Error1);
      await this.domainUserProvider.update(
        targetAccount.authId,
        targetUserId,
        user,
        _connect,
      );
    }
  }

  async getAllList(
    authId: string,
    authRole: AuthRole,
    _connect?: PrismaClient,
  ): Promise<AccountInfoFromDB[]> {
    return this.domainAccountGetListProvider.getAllListByAdmin(
      authId,
      authRole,
      _connect,
    );
  }
  async getDetail(
    authId: string,
    authRole: AuthRole,
    targetUserId: string,
    _connect?: PrismaClient,
  ): Promise<AccountInfoFromDB> {
    return this.domainAccountGetDetailProvider.getDetailByAdmin(
      authId,
      authRole,
      targetUserId,
      _connect,
    );
  }

  /* ============================
    以下、その他
  ============================ */

  protected connect(_connect: PrismaClient | undefined): PrismaClient {
    return _connect ? _connect : this.datasource.connect;
  }
}
