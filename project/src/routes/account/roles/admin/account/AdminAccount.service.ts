import { AdminDatasourceProvider } from '@/datasource';
import { DomainAccountProvider } from '@/domain/account/DomainAccount.provider';
import { DomainAccountGetDetailProvider } from '@/domain/account/DomainAccountGetDetail.provider';
import { DomainAccountGetListProvider } from '@/domain/account/DomainAccountGetList.provider';
import { DomainAuthDefaultProvider } from '@/domain/account/auth/default/DomainAuthDefault.provider';
import { DomainUserProvider } from '@/domain/account/user/DomainUser.provider';
import { AuthCookieProvider } from '@/domain/http';
import {
  AccountInfo,
  AccountInfoDto,
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
    private readonly domainAccountProvider: DomainAccountProvider,
    private readonly domainAccountGetListProvider: DomainAccountGetListProvider,
    private readonly domainAccountGetDetailProvider: DomainAccountGetDetailProvider,
    private readonly authCookieProvider: AuthCookieProvider,
    private readonly domainAuthDefaultProvider: DomainAuthDefaultProvider,
    private readonly domainUserProvider: DomainUserProvider,
  ) {}

  public async getAccountInfoByUserId(
    request: ExpressRequest,
    userId: string,
    _connect?: PrismaClient,
  ): Promise<AccountInfo> {
    // セッションは存在するか？
    const sessionId = request.cookies[this.authCookieProvider.sessionKey];
    if (!sessionId) throw NotFound(ErrorCode.Error12);
    // アカウントがadminであるか？
    const myAccount: AccountInfo =
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

  async getAllList(
    authId: string,
    authRole: AuthRole,
    _connect?: PrismaClient,
  ): Promise<AccountInfo[]> {
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
  ): Promise<AccountInfo> {
    return this.domainAccountGetDetailProvider.getDetailByAdmin(
      authId,
      authRole,
      targetUserId,
      _connect,
    );
  }
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
  protected connect(_connect: PrismaClient | undefined): PrismaClient {
    return _connect ? _connect : this.datasource.connect;
  }
}
