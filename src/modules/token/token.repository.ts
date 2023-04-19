import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import * as crypto from 'crypto';
import * as fs from 'fs';

import { Activations } from './entities/activations.entity';
import { User } from '../user/entities/user.entity';
import { Token } from './entities/token.entity';
import { ConfigService } from '../base/config/config.service';

@Injectable()
export class TokenRepository {
  constructor(
    @Inject('CONNECTION') private readonly connection: DataSource,
    @InjectRepository(Token)
    private readonly tokenRepository: Repository<Token>,
    private readonly configService: ConfigService,
  ) {}

  getPrivatekey(): string {
    const environment: string = this.configService.get('environment');
    return fs.readFileSync(
      `${process.cwd()}/configurations/keys/private.${environment}.key.pem`,
      { encoding: 'utf8' },
    );
  }

  getPublickey(): string {
    const environment: string = this.configService.get('environment');
    return fs.readFileSync(
      `${process.cwd()}/configurations/keys/public.${environment}.key.pem`,
      { encoding: 'utf8' },
    );
  }

  async saveHash(hash: string, user: User, email: string) {
    return this.connection
      .getRepository(Activations)
      .createQueryBuilder('activations')
      .insert()
      .values({
        user,
        email,
        hash,
      })
      .execute();
  }

  async saveRefreshToken(hash: string, user: User) {
    const hmac = crypto
      .createHmac('sha256', this.getPrivatekey())
      .update(hash)
      .digest('hex');

    const token = {
      hashed_token: hmac,
      user,
    };

    return this.tokenRepository.save(token);
  }

  async findByHashed(hashed_token: string): Promise<Token> {
    return this.tokenRepository.findOneBy({ hashed_token });
  }
}
