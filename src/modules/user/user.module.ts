import { Global, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserRepository } from './user.repository';

// Listeners
import { UserCreatedListener } from './listeners/UserCreatedListener';
import { Role } from './entities/role.entity';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([User, Role])],
  controllers: [UserController],
  providers: [UserService, UserRepository, UserCreatedListener],
  exports: [UserService, UserRepository],
})
export class UserModule {}
