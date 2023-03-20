import { Module } from '@nestjs/common';
import { ConsoleModule } from '@squareboat/nest-console';
import { EventEmitterModule } from '@nestjs/event-emitter';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from './modules/config/config.module';
import { UserModule } from './modules/user/user.module';
import DatabaseModule from './modules/database/database.module';
import { CreateUser } from './commands/create-user';
import { CreateKeypair } from './commands/create-keypair';
import { TokenModule } from './modules/token/token.module';

@Module({
  imports: [
    EventEmitterModule.forRoot(),
    ConfigModule,
    DatabaseModule,
    TokenModule,
    UserModule,
    ConsoleModule,
  ],
  controllers: [AppController],
  providers: [AppService, CreateUser, CreateKeypair],
})
export class AppModule {}
