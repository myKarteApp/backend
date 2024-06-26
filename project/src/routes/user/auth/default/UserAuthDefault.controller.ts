import { DefaultAuthDto } from '@/shared/dto';
import { Body, Controller, Post } from '@nestjs/common';
import { UserAuthDefaultService } from './UserAuthDefault.service';
import { MainDatasourceProvider } from '@/datasource/mainDatasource.provider';
import { AuthInfo } from '@prisma/client';
import { MyError, NotFound, Unexpected } from '@/utils/error';
import { v4 } from 'uuid';

@Controller('/user/auth/default')
export class UserAuthDefaultController {
  constructor(
    private readonly authService: UserAuthDefaultService,
    private readonly datasource: MainDatasourceProvider,
  ) {}

  /*
    認証データを登録する
  */
  @Post('create')
  async create(@Body() dto: DefaultAuthDto) {
    console.log('認証データを登録する');
    try {
      const newAuthId = v4();

      /*
          insertする
        */
      await this.authService.createAuthInfo(dto, newAuthId);
      /*
          新規認証データを取得する
        */
      const newAuthInfo: AuthInfo | null =
        await this.authService.findUnique(newAuthId);
      /*
          JWSを作成する
        */
      if (!newAuthInfo) throw NotFound();
      const jwsToken = await this.authService.createJwsToken(newAuthInfo);
      return {
        authId: newAuthInfo.authId,
        jwsToken: jwsToken,
      };
    } catch (error) {
      if (error instanceof MyError) throw error;
      throw Unexpected();
    } finally {
      await this.datasource.connect.$disconnect();
    }
  }
}
