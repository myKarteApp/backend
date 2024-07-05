import { Injectable } from '@nestjs/common';
import { ISendMailOptions, MailerService } from '@nestjs-modules/mailer';
import { Unexpected } from '@/utils/error';
import { ErrorCode } from '@/utils/errorCode';
import { AuthVerifyOneTimePass } from '@prisma/client';
import { ConfigProvider } from '@/config/config.provider';

@Injectable()
export class MailService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly configProvider: ConfigProvider,
  ) {}

  async sendTemporaryRegistration(
    email: string,
    authVerifyOneTimePass: AuthVerifyOneTimePass,
  ) {
    try {
      const dto: ISendMailOptions = {
        to: email,
        subject: '[MyKarte]仮登録ありがとうございます！',
        template: 'temporaryRegistration',
        context: {
          url: `https://${this.configProvider.APP_DOMAIN}/account/auth/default/verify?queryToken=${authVerifyOneTimePass.queryToken}`,
          expiresAt: authVerifyOneTimePass.expiresAt,
          passCode: authVerifyOneTimePass.passCode,
        },
      };
      await this.mailerService.sendMail(dto);
    } catch (error) {
      console.log(error);
      throw Unexpected(ErrorCode.Error25);
    }
  }

  // async sendResetPassword(email: string, passCode: string, queryToken: string) {
  //   try {
  //     const APP_DOMAIN = process.env.APP_DOMAIN || 'localhost';
  //     const mailDto: MailDto['temporaryRegistration'] = {
  //       email: email,
  //       passCode: passCode,
  //       url: `https://${APP_DOMAIN}/account/auth/default/verify?queryToken=${queryToken}`,
  //     };
  //     await this.send(mailDto, 'temporaryRegistration');
  //   } catch (error) {
  //     throw Unexpected(ErrorCode.Error25);
  //   }
  // }

  // async send(dto: any, mailDetailKye: keyof typeof MailDetail) {
  //   try {
  //     this.mailerService.sendMail(MailDetail[mailDetailKye](dto));
  //   } catch (error) {
  //     throw Unexpected(ErrorCode.Error26);
  //   }
  // }
}
