import { TokenController } from './modules/token/token.controller';
import { UserController } from './modules/user/user.controller';
import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ConsoleModule } from '@squareboat/nest-console';
import { EventEmitterModule } from '@nestjs/event-emitter';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from './modules/base/config/config.module';
import { UserModule } from './modules/user/user.module';
import DatabaseModule from './modules/base/database/database.module';
import { CreateUser } from './commands/create-user';
import { CreateKeypair } from './commands/create-keypair';
import { TokenModule } from './modules/token/token.module';
import { MailModule } from './modules/base/mail/mail.module';
import { JWTParserMiddleware } from './middlewares/JWTParser.middleware';

@Module({
  imports: [
    EventEmitterModule.forRoot(),
    ConfigModule,
    DatabaseModule,
    TokenModule,
    UserModule,
    ConsoleModule,
    MailModule,
  ],
  controllers: [AppController],
  providers: [AppService, CreateUser, CreateKeypair],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(JWTParserMiddleware)
      .exclude({ path: 'users/authenticate', method: RequestMethod.POST })
      .forRoutes(UserController, TokenController);
  }
}
