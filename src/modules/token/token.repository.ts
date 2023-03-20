import { Inject, Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Activations } from './entities/activations.entity';
import { User } from '../user/entities/user.entity';

@Injectable()
export class TokenRepository {
  constructor(@Inject('CONNECTION') private readonly connection: DataSource) {}

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
}
