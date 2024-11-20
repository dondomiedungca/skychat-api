import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { Global, Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { join } from 'path';
import { MailConfigType } from 'src/types/config.type';
import { ConfigService } from '../config/config.service';

@Global()
@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: async (configService: ConfigService) => {
        const mailConfig: MailConfigType = configService.get('mail');
        return {
          transport: {
            host: mailConfig.host,
            secure: mailConfig.secure,
            auth: {
              user: mailConfig.auth.user,
              pass: mailConfig.auth.pass,
            },
          },
          defaults: {
            from: mailConfig.from,
          },
          template: {
            dir: join(__dirname, 'templates'),
            adapter: new HandlebarsAdapter(),
            options: {
              strict: true,
            },
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
