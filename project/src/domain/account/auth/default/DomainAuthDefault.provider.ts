import { Injectable, Scope } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { AuthInfo, AuthType, PrismaClient } from '@prisma/client';
import {
  AuthRole,
  CreateAuthInfoDtoForAccount,
  DefaultColumns,
  removeUndefined,
} from '@/shared';
import { SpecDatasourceProvider } from '@/spec/SpecDatasource.provider';
import { BadRequest } from '@/utils/error';
import { ErrorCode } from '@/utils/errorCode';

@Injectable({ scope: Scope.REQUEST })
export class DomainAuthDefaultProvider {
  private readonly hashSalt = 10;
  public datasource: SpecDatasourceProvider;
  /*
    create
  */
  public async createAuthInfo(
    data: Omit<AuthInfo, DefaultColumns>,
    _connect?: PrismaClient,
  ): Promise<void> {
    data.password = await this.hashPassword(data.password);
    await this.connect(_connect).authInfo.create({
      data: data,
    });
  }
  private async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, this.hashSalt);
  }

  /*
    read
  */
  public async findById(
    authId: string,
    authType?: AuthType,
    authRole?: AuthRole,
    _connect?: PrismaClient,
  ): Promise<AuthInfo | null> {
    const where = {
      authId: authId,
      isDeleted: false,
    };

    if (authType) where['authType'] = authType;
    if (authRole) where['authRole'] = authRole;

    return this.connect(_connect).authInfo.findUnique({
      where: where,
    });
  }

  public async findByEmailAndPassword(
    email: string,
    password: string,
    _connect?: PrismaClient,
  ): Promise<AuthInfo | null> {
    const authInfo: AuthInfo | null = await this.connect(
      _connect,
    ).authInfo.findUnique({
      where: {
        email: email,
        isDeleted: false,
      },
    });
    if (!authInfo) return null;
    if (!this.comparePasswords(password, authInfo.password)) return null;
    return authInfo;
  }

  // public async findByEmail(
  //   email: string,
  //   _connect?: PrismaClient,
  // ): Promise<AuthInfo | null> {
  //   const authInfo: AuthInfo | null = await this.connect(
  //     _connect,
  //   ).authInfo.findUnique({
  //     where: {
  //       email: email,
  //       isDeleted: false,
  //     },
  //   });
  //   if (!authInfo) return null;
  //   if (!this.comparePasswords(dto.password, authInfo.password)) return null;
  //   return authInfo;
  // }

  public async comparePasswords(
    plainPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    // bcryptを使用して平文のパスワードをハッシュ化されたパスワードと比較する
    return bcrypt.compare(plainPassword, hashedPassword);
  }
  /*
    update
  */
  public async verifyAuthInfo(
    authId: string,
    updatedBy: string,
    _connect?: PrismaClient,
  ): Promise<AuthInfo | null> {
    return this.connect(_connect).authInfo.update({
      data: {
        isVerify: true,
        updatedBy: updatedBy,
      },
      where: {
        authId: authId,
      },
    });
  }
  // update
  public async update(
    authId: string,
    dto: Partial<CreateAuthInfoDtoForAccount>,
    updatedBy: string,
    _connect?: PrismaClient,
  ): Promise<void> {
    const data = removeUndefined<CreateAuthInfoDtoForAccount>(dto);
    if (Object.keys(data).length === 0) return;

    const result: AuthInfo | null = await this.connect(
      _connect,
    ).authInfo.update({
      data: {
        ...data,
        updatedBy: updatedBy,
      },
      where: {
        authId: authId,
      },
    });
    if (!result) throw BadRequest(ErrorCode.Error17);
  }

  // delete
  public async delete(
    authIdList: string[],
    _connect?: PrismaClient,
  ): Promise<void> {
    const result = await this.connect(_connect).authInfo.updateMany({
      where: {
        authId: {
          in: authIdList,
        },
      },
      data: {
        isDeleted: true,
      },
    });
    if (authIdList.length !== result.count) throw BadRequest(ErrorCode.Error18);
  }
  /*
    other
  */
  protected connect(_connect: PrismaClient | undefined): PrismaClient {
    return _connect ? _connect : this.datasource.connect;
  }
}
