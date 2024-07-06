import { Body, Controller, Get, Post, Query, Req, Res } from '@nestjs/common';
import {
  Request as ExpressRequest,
  Response as ExpressResponse,
} from 'express';
import { MainDatasourceProvider } from '@/datasource';

import { ApiBody, ApiTags } from '@nestjs/swagger';
import { BadRequest, NotFound } from '@/utils/error';
import { ErrorCode } from '@/utils/errorCode';
import { CSRF_HEADER, validateRegisterDto } from '@/shared';
import { AuthVerifyService } from './AuthVerify.service';
import { AuthInfo, AuthVerifyOneTimePass, PrismaClient } from '@prisma/client';
import { CsrfSessionProvider } from '@/domain/http/CsrfSession.provider';
import { _RegisterDto } from './swaggerDto';
import { ConfigProvider } from '@/config/config.provider';
import { RequestBody, ResponseBody } from '@/shared/apiSchema/paths';

@ApiTags('AccountAuthVerify')
@Controller('/account/auth/verify')
export class AuthVerifyController {
  constructor(
    private readonly datasource: MainDatasourceProvider,
    private readonly authVerifyService: AuthVerifyService,
    private readonly csrfSessionProvider: CsrfSessionProvider,
    private readonly configProvider: ConfigProvider,
  ) {}

  @Get('')
  async confirmRegistration(
    @Req() request: ExpressRequest,
    @Res() response: ExpressResponse,
    @Query('queryToken') queryToken?: string,
  ) {
    if (!queryToken) throw BadRequest(ErrorCode.Error24);
    if (queryToken.length <= 0) throw BadRequest(ErrorCode.Error40);
    try {
      await this.datasource.transact(async (connect: PrismaClient) => {
        // トークンの期限は有効であるか？
        const oneTimePass: AuthVerifyOneTimePass | null =
          await this.authVerifyService.findByQueryToken(queryToken, connect);
        if (!oneTimePass) throw NotFound(ErrorCode.Error16);
        if (oneTimePass.expiresAt < new Date())
          throw NotFound(ErrorCode.Error29);

        // 認証情報が未認証であるか？
        const authInfo: AuthInfo | null =
          await this.authVerifyService.findAuthInfoById(oneTimePass.authId);
        if (!authInfo) throw NotFound(ErrorCode.Error30);
        if (authInfo.isVerify) throw NotFound(ErrorCode.Error31);
      });
      const csrfToken = this.csrfSessionProvider.setCsrfToken(request);
      const APP_DOMAIN = this.configProvider.APP_DOMAIN;
      const html = `
        <!DOCTYPE html>
        <html lang="ja">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Hello NestJS</title>
          <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
          <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
          <style>
            .a-ErrorText {
              color: #EF4444; /* エラーメッセージの色 */
              font-size: 0.875rem; /* フォントサイズ */
              margin-top: 0.25rem; /* 上部のマージン */
              padding-left: 16px;
            }
          </style>
        </head>
        <body class="bg-gray-100 flex justify-center items-center h-screen">
          <div class="bg-white p-8 rounded shadow-md w-full max-w-sm">
            <h1 class="text-2xl font-bold mb-6">本登録画面</h1>
            <p class="font-bold mb-6">登録した情報を再度、入力してください</p>
            <form action="https://${APP_DOMAIN}/api/account/auth/verify" method="POST">
              <div class="mb-4">
                <label for="email" class="block text-sm font-medium text-gray-700">Email:</label>
                <input type="email" name="email" id="email" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                <p id='emailError' class='a-ErrorText'></p>
              </div>
              <div class="mb-4">
                <label for="password" class="block text-sm font-medium text-gray-700">Password:</label>
                <input type="password" name="password" id="password" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                <p id='passwordError' class='a-ErrorText'></p>
              </div>
              <div class="mb-6">
                <label for="passCode" class="block text-sm font-medium text-gray-700">PassCode</label>
                <p>メールに記載されているコードを記載してください。</p>
                <input type="text" name="passCode" id="passCode" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                <p id='passCodeError' class='a-ErrorText'></p>
              </div>
              <div>
                <input type='hidden' name='queryToken' value='${queryToken}' id='queryToken'/>
                <p id='queryTokenError' class='a-ErrorText'></p>
              </div>
              <button type="submit" class="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
                送信
              </button>
            </form>
          </div>
          <script>
            const appDomain = '${APP_DOMAIN}';
            $(document).ready(function() {
              $('form').submit(function(event) {
                event.preventDefault();

                // エラー文を初期化する
                $('#emailError').text('');
                $('#passwordError').text('');
                $('#passCodeError').text('');
                $('#queryTokenError').text('');

                // フォームデータを取得する
                var dto = {
                  email: $('#email').val(),
                  password: $('#password').val(),
                  passCode: $('#passCode').val(),
                  queryToken: $('#queryToken').val(),
                };
                
                // フォームデータを検証する
                const validator = validateRegisterDto(dto);
                if (validator.hasError()) {
                  Object.keys(validator.error).forEach(key => {
                    const errorMessage = validator.error[key];
                    $(key).text(errorMessage);
                  });
                  return;
                };

                $.ajax({
                  type: 'POST',
                  url: "https://" + appDomain + "/api/account/auth/verify",
                  data: JSON.stringify(dto),
                  headers: {
                    'Content-Type': 'application/json',
                    '${CSRF_HEADER}': '${csrfToken}',
                  },
                  success: function(response) {
                    alert('本登録できました！');
                    window.location.href = "https://" + appDomain;
                  },
                  error: function(error) {
                    alert('エラー発生！正しく登録した情報を再度、入力してください');
                  }
                });
              });

              class Validator {
                constructor() {
                    this.error = {};
                }
                pushError(key, message) {
                  this.error[key] = message;
                }
                hasError() {
                  return Object.keys(this.error).length > 0;
                }
              }
              const validateRegisterDto = (dto) => {
                const validator = new Validator();
                if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(dto.email))
                  validator.pushError('#emailError', 'emailを正しく入力しください。');
                if (Object.keys(dto.password).length < 8)
                  validator.pushError('#passwordError', 'パスワードは8文字以上で記載してください。');
                if (Object.keys(dto.passCode).length !== 6)
                  validator.pushError('#passCodeError', 'パスコードは6文字で記載してください。');
                if (Object.keys(dto.queryToken).length === 0)
                  validator.pushError('#queryTokenError', '不正な操作が行われました。');
                return validator;
              };
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

  @ApiBody({ type: _RegisterDto })
  @Post('')
  async register(
    @Req() request: ExpressRequest,
    @Res() response: ExpressResponse,
    @Body() dto: RequestBody<'register'>,
  ) {
    // 事前処理
    const validator = validateRegisterDto(dto);
    if (validator.hasError()) throw BadRequest(ErrorCode.Error41);
    this.csrfSessionProvider.verifyCsrfToken(request);

    // メイン処理
    await this.datasource.transact(async (connect: PrismaClient) => {
      // 認証情報の確認をする
      const authInfo = await this.authVerifyService.findByEmailAndPassword(
        dto.email,
        dto.password,
        connect,
      );
      if (!authInfo) throw NotFound(ErrorCode.Error32);
      // クーポンの有効性を確認する
      await this.authVerifyService.findOTP(dto.passCode, dto.queryToken);
      // 認証情報を有効にする
      const verifiedAuthInfo: AuthInfo | null =
        await this.authVerifyService.verifyAuthInfo(authInfo.authId);
      if (!verifiedAuthInfo) throw NotFound(ErrorCode.Error33);
    });
    // 事後処理
    const responseBody: ResponseBody<'register'> = {
      message: 'OK',
    };
    response.status(200).json(responseBody);
  }
}
