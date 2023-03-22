import { MailerService } from '@nestjs-modules/mailer/dist';
import { Injectable } from '@nestjs/common';
import { MailConfigType } from 'src/types/config.type';
import { ConfigService } from '../config/config.service';
import { User } from '../../user/entities/user.entity';

@Injectable()
export class MailService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {}
  async sendUserConfirmation(user: User, hash: string) {
    const appUrl = this.configService.get('APP_URL') || 'www.test.com';
    const appTitle = this.configService.get('APP_TITLE') || 'My test app';
    const mailConfig: MailConfigType = this.configService.get('mail');
    const url = `${appUrl}/auth/confirm?token=${hash}`;
    await this.mailerService.sendMail({
      to: user.email,
      from: `"Support Team" <${mailConfig.from}>`,
      subject: `Welcome to ${appTitle}. Confirm your Email`,
      template: './confirmation',
      context: {
        firstName: user.firstName,
        verificationUrl: url,
      },
    });
  }
}
