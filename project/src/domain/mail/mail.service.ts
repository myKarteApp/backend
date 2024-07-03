import { Injectable } from '@nestjs/common';
import { ISendMailOptions, MailerService } from '@nestjs-modules/mailer';
import { DefaultAuthDto } from '@/shared';
import { Unexpected } from '@/utils/error';
import { ErrorCode } from '@/utils/errorCode';

export type MailDto = {
  temporaryRegistration: {
    email: string;
    passCode: string;
    url: string;
  };
};

export const MailDetail = {
  temporaryRegistration: (dto: DefaultAuthDto): ISendMailOptions => {
    return {
      to: dto.email,
      subject: '[MyKarte]仮登録ありがとうございます！',
      template: 'temporaryRegistration',
      context: {
        email: dto.email,
        expiredAt: '',
      },
    };
  },
};

@Injectable()
export class MailService {
  private appDomain: string;
  constructor(private readonly mailerService: MailerService) {
    const appDomain = process.env.APP_DOMAIN;
    if (!appDomain) throw Unexpected(ErrorCode.Error24);
    this.appDomain = appDomain;
  }

  async sendTemporaryRegistration(
    email: string,
    passCode: string,
    queryToken: string,
  ) {
    try {
      const mailDto: MailDto['temporaryRegistration'] = {
        email: email,
        passCode: passCode,
        url: `https://${this.appDomain}/account/auth/default/verify?queryToken=${queryToken}`,
      };
      await this.send(mailDto, 'temporaryRegistration');
    } catch (error) {
      throw Unexpected(ErrorCode.Error25);
    }
  }

  async send(dto: any, mailDetailKye: keyof typeof MailDetail) {
    try {
      this.mailerService.sendMail(MailDetail[mailDetailKye](dto));
    } catch (error) {
      throw Unexpected(ErrorCode.Error26);
    }
  }
}
