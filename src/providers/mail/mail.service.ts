import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { MailTypeEnum, SendMailDto } from './dto/send-mail.dto';
import { deleteAccountTemplate } from './template/delete-account.template';
import { movieAvailableTemplate } from './template/movie-available.template';
import { newAccountTemplate } from './template/new-account.template';
import { recoveryPasswordTemplate } from './template/recovery-password.template';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    void this.configure();
  }

  private configure() {
    this.transporter = nodemailer.createTransport({
      service: process.env.MAIL_SERVICE,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });
  }

  private readonly templates = {
    [MailTypeEnum.WELCOME]: (data) => newAccountTemplate(data.username),
    [MailTypeEnum.FORGOT_PASSWORD]: (data) =>
      recoveryPasswordTemplate(data.username, data.code, data.email),
    [MailTypeEnum.DELETE_ACCOUNT]: (data) =>
      deleteAccountTemplate(data.username),
    [MailTypeEnum.MOVIE_AVAILABLE]: (data) =>
      movieAvailableTemplate(data.username, data.movieTitle),
  };

  async sendMail({ to, subject, type, ...rest }: SendMailDto) {
    const template = this.templates[type](rest);
    try {
      const info = await this.transporter.sendMail({
        from: process.env.MAIL_FROM,
        to,
        subject,
        html: template,
      });

      return {
        messageId: info.messageId,
      };
    } catch {
      return {
        messageId: null,
      };
    }
  }
}
