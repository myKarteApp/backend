import { Injectable, Scope } from '@nestjs/common';
import { AuthVerifyOneTimePass, PrismaClient } from '@prisma/client';
import { SpecDatasourceProvider } from '@/spec/SpecDatasource.provider';
import { v4 } from 'uuid';
import { ONE_TIME_PASS_EXPIRATION } from '@/config';

@Injectable({ scope: Scope.REQUEST })
export class DomainAuthVerifyOneTimePassProvider {
  public datasource: SpecDatasourceProvider;
  /*
    create
  */
  public async create(
    authId: string,
    _connect?: PrismaClient,
  ): Promise<string> {
    const authVerifyOneTimePassId = v4();

    const data = {
      authVerifyOneTimePassId: authVerifyOneTimePassId,
      authId: authId,
      queryToken: v4(),
      passCode: (Math.floor(Math.random() * 900000) + 100000).toString(),
      // 5分先までを有効とする
      expiresAt: new Date(new Date().getTime() + ONE_TIME_PASS_EXPIRATION),
    };
    await this.connect(_connect).authVerifyOneTimePass.create({
      data: data,
    });

    return authVerifyOneTimePassId;
  }

  /*
    read
  */
  public async findById(
    authVerifyOneTimePassId: string,
    _connect?: PrismaClient,
  ): Promise<AuthVerifyOneTimePass | null> {
    return this.connect(_connect).authVerifyOneTimePass.findUnique({
      where: {
        authVerifyOneTimePassId: authVerifyOneTimePassId,
        isDeleted: false,
      },
    });
  }

  public async findByQueryToken(
    queryToken: string,
    _connect?: PrismaClient,
  ): Promise<AuthVerifyOneTimePass | null> {
    return this.connect(_connect).authVerifyOneTimePass.findFirst({
      where: {
        queryToken: queryToken,
      },
    });
  }

  // public async findByEmail(
  //   dto: DefaultAuthDto,
  //   authType: AuthType,
  //   authRole: AuthRole,
  //   _connect?: PrismaClient,
  // ): Promise<AuthInfo | null> {
  //   const authInfo: AuthInfo | null = await this.connect(
  //     _connect,
  //   ).authInfo.findUnique({
  //     where: {
  //       email: dto.email,
  //       authType: authType,
  //       authRole: authRole,
  //       isDeleted: false,
  //     },
  //   });
  //   if (!authInfo) return null;
  //   if (!this.comparePasswords(dto.password, authInfo.password)) return null;
  //   return authInfo;
  // }

  // public async comparePasswords(
  //   plainPassword: string,
  //   hashedPassword: string,
  // ): Promise<boolean> {
  //   // bcryptを使用して平文のパスワードをハッシュ化されたパスワードと比較する
  //   return bcrypt.compare(plainPassword, hashedPassword);
  // }

  /*
    other
  */
  protected connect(_connect: PrismaClient | undefined): PrismaClient {
    return _connect ? _connect : this.datasource.connect;
  }
}
