import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';
import { AuthInfo } from '@prisma/client';
import { MainDatasourceProvider } from '@/datasource/mainDatasource.provider';
import { DefaultAuthDto } from '@/shared';

@Injectable()
export class UserAuthDefaultService {
  constructor(private readonly datasource: MainDatasourceProvider) {}

  private readonly privateKey = process.env.JWS_PRIVATE_KEY;
  private readonly jwsExpiresIn = '1h';
  private readonly hashSalt = 10;

  public async createAuthInfo(dto: DefaultAuthDto, newAuthId: string) {
    await this.datasource.connect.authInfo.create({
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

  public async findUnique(authId: string): Promise<AuthInfo | null> {
    return this.datasource.connect.authInfo.findUnique({
      where: {
        authId: authId,
      },
    });
  }
  public async createJwsToken(dto: AuthInfo): Promise<string> {
    return jwt.sign(dto, this.privateKey, { expiresIn: this.jwsExpiresIn });
  }

  public async comparePasswords(
    plainPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    // bcryptを使用して平文のパスワードをハッシュ化されたパスワードと比較する
    return bcrypt.compare(plainPassword, hashedPassword);
  }
}
