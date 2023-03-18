import { RolesType } from './../../types/roles.type';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from './entities/user.entity';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  findByEmail(email: string): Promise<User> {
    return this.userRepository.findOneBy({ email });
  }

  create(data: Partial<User>, role: RolesType): Promise<User> {
    return this.userRepository.save(data);
  }
}
