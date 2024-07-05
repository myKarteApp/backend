// import { DefaultAuthDto } from '@/shared/dto';
// import { Body, Controller, Post, Req, Res } from '@nestjs/common';
// import { PrismaClient } from '@prisma/client';
// import { NotFound } from '@/utils/error';
// import {
//   Request as ExpressRequest,
//   Response as ExpressResponse,
// } from 'express';

// import { ResponseBody } from '@/shared';
// import { ErrorCode } from '@/utils/errorCode';
// import { AdminDatasourceProvider } from '@/datasource';
// import { AuthCookieProvider } from '@/domain/http';
// import { AdminService } from '../../Admin.service';

// @Controller('/admin/auth/default')
// export class AdminAuthDefaultController {
//   constructor(
//     private readonly adminService: AdminService,
//     private readonly datasource: AdminDatasourceProvider,
//     private readonly authCookieProvider: AuthCookieProvider,
//   ) {}
//   @Post('login')
//   async login(@Body() dto: DefaultAuthDto, @Res() response: ExpressResponse) {
//     const authId = await this.datasource.transact(
//       async (connect: PrismaClient) => {
//         const authInfo = await this.adminService.findByEmail(dto, connect);
//         if (!authInfo) throw NotFound(ErrorCode.Error14);
//         const jwsToken =
//           await this.authCookieProvider.jwsTokenProvider.createJwsToken(
//             authInfo,
//           );
//         await this.authCookieProvider.setAuthSessionId(
//           response,
//           jwsToken,
//           connect,
//         );
//         return authInfo.authId;
//       },
//     );
//     const responseBody: ResponseBody<'loginAdminAuthDefault'> = {
//       message: 'OK',
//       data: {
//         authId: authId,
//       },
//     };
//     response.status(200).json(responseBody);
//   }
//   @Post('logout')
//   async logout(
//     @Req() request: ExpressRequest,
//     @Res() response: ExpressResponse,
//   ) {
//     await this.datasource.transact(async (connect: PrismaClient) => {
//       const sessionId = request.cookies[this.authCookieProvider.sessionKey];
//       if (!sessionId) return;
//       await this.authCookieProvider.clearAuthSessionId(
//         response,
//         sessionId,
//         connect,
//       );
//     });
//     const responseBody: ResponseBody<'logoutAdminAuthDefault'> = {
//       message: 'OK',
//     };
//     response.status(200).json(responseBody);
//   }
// }
