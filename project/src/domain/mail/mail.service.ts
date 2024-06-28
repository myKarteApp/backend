import { Injectable } from '@nestjs/common';
import { ISendMailOptions, MailerService } from '@nestjs-modules/mailer';
import { DefaultAuthDto } from '@/shared';

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
  constructor(private readonly mailerService: MailerService) {}

  async sendTest(dto: any, mailDetailKye: keyof typeof MailDetail) {
    await this.mailerService.sendMail(MailDetail[mailDetailKye](dto));
  }
}
