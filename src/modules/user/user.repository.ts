import { RolesType } from './../../types/roles.type';
import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

import { User } from './entities/user.entity';
import { Role } from './entities/role.entity';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @Inject('CONNECTION') private readonly connection: DataSource,
  ) {}

  findByEmail(email: string): Promise<User> {
    return this.userRepository.findOneBy({ email });
  }

  findById(id: string): Promise<User> {
    return this.connection
      .getRepository(User)
      .createQueryBuilder('users')
      .leftJoinAndSelect('users.roles', 'roles')
      .where('users.id = :id', { id })
      .getOne();
  }

  create(data: Partial<User>): Promise<User> {
    return this.userRepository.save(data);
  }

  getRole(name: string): Promise<Role> {
    return this.connection
      .getRepository(Role)
      .createQueryBuilder('roles')
      .where('roles.name = :name', { name })
      .getOne();
  }
}
