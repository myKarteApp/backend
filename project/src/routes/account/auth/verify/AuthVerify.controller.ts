import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Render,
  Req,
  Res,
} from '@nestjs/common';
import { Request as ExpressRequest, Response as ExpressResponse } from 'express';
import * as csurf from 'csurf';

import { MainDatasourceProvider } from '@/datasource';

import { ApiTags } from '@nestjs/swagger';
import { NotFound, Unexpected } from '@/utils/error';
import { ErrorCode } from '@/utils/errorCode';
import { RegisterDto, ResponseBody } from '@/shared';
import { AuthVerifyService } from './AuthVerify.service';
import { AuthInfo, AuthVerifyOneTimePass, PrismaClient } from '@prisma/client';

@ApiTags('AuthVerify')
@Controller('/account/auth/verify')
export class AuthVerifyController {
  constructor(
    private readonly datasource: MainDatasourceProvider,
    private readonly authVerifyService: AuthVerifyService,
  ) {}

  @Get('')
  async confirmRegistration(
    @Query('queryToken') queryToken: string,
    @Req() request,
    @Res() response: ExpressResponse,
  ) {
    try {
      request.session;
      const appDomain = process.env.APP_DOMAIN;
      if (!appDomain) throw Unexpected(ErrorCode.Error28);
      await this.datasource.transact(async (connect: PrismaClient) => {
        /* トークンの有効性を確認する
            - トークンが有効期限切れ
            - 対象の認証情報が有効化済み
          */
        const oneTimePass: AuthVerifyOneTimePass | null =
          await this.authVerifyService.findByQueryToken(queryToken, connect);
        if (!oneTimePass) throw NotFound(ErrorCode.Error16);
        if ((oneTimePass.expiresAt = new Date()))
          throw NotFound(ErrorCode.Error29);

        // 認証情報を取得する
        const authInfo: AuthInfo | null =
          await this.authVerifyService.findAuthInfoById(oneTimePass.authId);
        if (!authInfo) throw NotFound(ErrorCode.Error30);
        if (authInfo.isVerify) throw NotFound(ErrorCode.Error31);
      });

      const html = `
        <!DOCTYPE html>
        <html lang="ja">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Hello NestJS</title>
          <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
          <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
        </head>
        <body class="bg-gray-100 flex justify-center items-center h-screen">
          <div class="bg-white p-8 rounded shadow-md w-full max-w-sm">
            <h1 class="text-2xl font-bold mb-6">本登録画面</h1>
            <p class="font-bold mb-6">登録した情報を再度、入力してください</p>
            <form action="https://${appDomain}/api/account/auth/verify" method="POST">
              <div class="mb-4">
                <label for="email" class="block text-sm font-medium text-gray-700">Email:</label>
                <input type="email" name="email" id="email" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
              </div>
              <div class="mb-4">
                <label for="password" class="block text-sm font-medium text-gray-700">Password:</label>
                <input type="password" name="password" id="password" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
              </div>
              <div class="mb-6">
                <label for="passCode" class="block text-sm font-medium text-gray-700">PassCode:</label>
                <input type="text" name="passCode" id="passCode" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
              </div>
              <input type='hidden' name='queryToken' value='${queryToken}' id='queryToken'/>
              <input type='hidden' name='_csrf' value='${request.csrfToken()}' id='_csrf'/>

              <button type="submit" class="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
                送信
              </button>
            </form>
          </div>
          <script>
            $(document).ready(function() {
              $('form').submit(function(event) {
                event.preventDefault();

                // フォームデータを取得
                var formData = {
                  email: $('#email').val(),
                  password: $('#password').val(),
                  passCode: $('#passCode').val(),
                  queryToken: $('#queryToken').val(),
                };
                $.ajax({
                  type: 'POST',
                  url: "https://${appDomain}/api/account/auth/verify",
                  data: formData,
                  success: function(response) {
                    alert('本登録できました！');
                    window.location.href = "https://${appDomain}";
                  },
                  error: function(error) {
                    alert('エラー発生！正しく登録した情報を再度、入力してください');
                  }
                });
              });
            });
          </script>
        </body>
        </html>

      `;
      response.setHeader('Content-Type', 'text/html');
      response.send(html);
    } catch (error) {
      throw error;
    }
  }
  @Post('')
  async register(@Body() dto: RegisterDto, @Res() response: ExpressResponse) {
    await this.datasource.transact(async (connect: PrismaClient) => {
      // 認証情報の確認をする
      const authInfo = await this.authVerifyService.findByEmail(dto, connect);
      if (!authInfo) throw NotFound(ErrorCode.Error32);
      // 認証情報を有効にする

      const verifiedAuthInfo: AuthInfo | null =
        await this.authVerifyService.verifyAuthInfo(authInfo.authId);
      if (!verifiedAuthInfo) throw NotFound(ErrorCode.Error33);
    });

    const responseBody: ResponseBody<'register'> = {
      message: 'OK',
    };
    response.status(200).json(responseBody);
  }
}
