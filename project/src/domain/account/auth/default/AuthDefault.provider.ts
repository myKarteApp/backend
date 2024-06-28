import { Injectable, Scope } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { AuthInfo, AuthType, PrismaClient } from '@prisma/client';
import { AuthRole, DefaultAuthDto, DefaultColumns } from '@/shared';
import { SpecDatasourceProvider } from '@/spec/SpecDatasource.provider';

@Injectable({ scope: Scope.REQUEST })
export class DomainAuthDefaultProvider {
  private readonly hashSalt = 10;
  public datasource: SpecDatasourceProvider;
  /*
    create
  */
  public async createAuthInfo(
    data: Omit<AuthInfo, DefaultColumns | 'isTrial'>,
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
    authType: AuthType,
    authRole: AuthRole,
    _connect?: PrismaClient,
  ): Promise<AuthInfo | null> {
    return this.connect(_connect).authInfo.findUnique({
      where: {
        authId: authId,
        authType: authType,
        authRole: authRole,
        isDeleted: false,
      },
    });
  }

  public async findByEmail(
    dto: DefaultAuthDto,
    authType: AuthType,
    authRole: AuthRole,
    _connect?: PrismaClient,
  ): Promise<AuthInfo | null> {
    const authInfo: AuthInfo | null = await this.connect(
      _connect,
    ).authInfo.findUnique({
      where: {
        email: dto.email,
        authType: authType,
        authRole: authRole,
        isDeleted: false,
      },
    });
    if (!authInfo) return null;
    if (!this.comparePasswords(dto.password, authInfo.password)) return null;
    return authInfo;
  }

  public async comparePasswords(
    plainPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    // bcryptを使用して平文のパスワードをハッシュ化されたパスワードと比較する
    return bcrypt.compare(plainPassword, hashedPassword);
  }

  /*
    other
  */
  protected connect(_connect: PrismaClient | undefined): PrismaClient {
    return _connect ? _connect : this.datasource.connect;
  }
}
