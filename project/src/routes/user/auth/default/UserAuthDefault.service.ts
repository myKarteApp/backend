import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { AuthInfo, PrismaClient } from '@prisma/client';
import { DefaultAuthDto } from '@/shared';
import { MainDatasourceProvider } from '@/datasource';

@Injectable()
export class UserAuthDefaultService {
  private readonly hashSalt = 10;
  constructor(protected readonly datasource: MainDatasourceProvider) {}
  /*
    create
  */
  public async createAuthInfo(
    dto: DefaultAuthDto,
    newAuthId: string,
    _connect?: PrismaClient,
  ) {
    await this.connect(_connect).authInfo.create({
      data: {
        authId: newAuthId,
        email: dto.email,
        password: await this.hashPassword(dto.password),
        authType: 'default',
        authRole: 'guest',
      },
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
    _connect?: PrismaClient,
  ): Promise<AuthInfo | null> {
    return this.connect(_connect).authInfo.findUnique({
      where: {
        authId: authId,
        isDeleted: false,
      },
    });
  }

  public async findByEmail(
    dto: DefaultAuthDto,
    _connect?: PrismaClient,
  ): Promise<AuthInfo | null> {
    const authInfo: AuthInfo | null = await this.connect(
      _connect,
    ).authInfo.findUnique({
      where: {
        email: dto.email,
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
