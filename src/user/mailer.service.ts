// mailer.service.ts

import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailerService {
  private transporter = nodemailer.createTransport({
    service: 'sandbox.smtp.mailtrap.io',
    port: 2525,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  async sendMail(from: string, to: string, subject: string, text: string) {
   return await this.transporter.sendMail({
      from: process.env.EMAIL_USERNAME,
      to,
      subject,
      text,
    });
  }
}
