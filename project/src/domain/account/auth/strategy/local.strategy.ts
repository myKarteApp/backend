// import { Strategy } from 'passport-local';
// import { PassportStrategy } from '@nestjs/passport';
// import { Injectable } from '@nestjs/common';
// import { AuthInfo, PrismaClient } from '@prisma/client';
// import { NotFound } from '@/utils/error';
// import { ErrorCode } from '@/utils/errorCode';
// import * as bcrypt from 'bcrypt';
// import { MainDatasourceProvider } from '@/datasource';

// @Injectable()
// export class LocalStrategy extends PassportStrategy(Strategy) {
//   constructor(protected readonly datasource: MainDatasourceProvider) {
//     super();
//   }

//   async validateAuthInfo(
//     email: string,
//     password: string,
//     _connect?: PrismaClient,
//   ): Promise<AuthInfo> {
//     const authInfo = await this.connect(_connect).authInfo.findFirst({
//       where: {
//         email: email,
//         isDeleted: false,
//       },
//     });
//     if (!authInfo) throw NotFound(ErrorCode.Error35);

//     const result = await this.comparePasswords(password, authInfo.password);
//     if (!result) throw NotFound(ErrorCode.Error36);
//     return authInfo;
//   }

//   public async comparePasswords(
//     plainPassword: string,
//     hashedPassword: string,
//   ): Promise<boolean> {
//     // bcryptを使用して平文のパスワードをハッシュ化されたパスワードと比較する
//     return bcrypt.compare(plainPassword, hashedPassword);
//   }

//   protected connect(_connect: PrismaClient | undefined): PrismaClient {
//     return _connect ? _connect : this.datasource.connect;
//   }
// }
