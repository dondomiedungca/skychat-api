import { Global, Module } from '@nestjs/common';
import { TokenService } from './token.service';
import { TokenController } from './token.controller';
import { TokenRepository } from './token.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Token } from './entities/token.entity';
import DatabaseModule from '../base/database/database.module';
import { Activations } from './entities/activations.entity';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([Token, Activations]), DatabaseModule],
  controllers: [TokenController],
  providers: [TokenService, TokenRepository],
  exports: [TokenService, TokenRepository],
})
export class TokenModule {}
