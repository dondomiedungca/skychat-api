import { Module } from '@nestjs/common';
import { ConsoleModule } from '@squareboat/nest-console';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from './modules/config/config.module';
import { UserModule } from './modules/user/user.module';
import DatabaseModule from './modules/database/database.module';
import { CreateUser } from './commands/create-user';

@Module({
  imports: [ConfigModule, DatabaseModule, UserModule, ConsoleModule],
  controllers: [AppController],
  providers: [AppService, CreateUser],
})
export class AppModule {}
