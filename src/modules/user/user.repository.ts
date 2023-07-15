import { RolesType } from './../../types/roles.type';
import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import * as moment from 'moment';

import { User, UserMeta } from './entities/user.entity';
import { Role } from './entities/role.entity';

interface ColumnFinder<T> {
  type: 'JSON' | 'ARRAY';
  condition: '=' | '!=' | '>' | '>=' | '<' | '<=' | 'LIKE' | 'ILIKE' | 'NOT IN';
  column: keyof T;
  property: string;
  value: any;
  valueType: any;
}

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

  async findOrCreate(
    user: Partial<User>,
    keys: Array<keyof Partial<User> | ColumnFinder<User>>,
  ): Promise<User> {
    const query = this.connection
      .getRepository(User)
      .createQueryBuilder('users')
      .leftJoinAndSelect('users.roles', 'roles');

    let values = {};
    let whereClause: string | string[] = [];

    if (keys.length) {
      keys.map((key) => {
        if (typeof key === 'string') {
          values = {
            ...values,
            [key]: user[key],
          };
          whereClause = [...whereClause, `users.${key} = :${key}`];
        }
        if (typeof key === 'object') {
          whereClause = [
            ...whereClause,
            `(${key.column} ->> '${key.property}')::${key.valueType} ${key.condition} ${key.value}`,
          ];
        }
      });
      whereClause = whereClause.join(' AND ');
    }

    const getUserByEmail = await query.where(whereClause, values).getOne();

    if (!!getUserByEmail) {
      const old_meta = getUserByEmail?.user_meta as unknown as UserMeta;
      const new_user_meta = {
        ...(old_meta || {}),
        activity: {
          ...old_meta.activity,
          last_active: moment.utc().toDate(),
          is_active: true,
        },
      };

      await this.connection
        .getRepository(User)
        .createQueryBuilder('users')
        .update(User)
        .set({ user_meta: JSON.stringify(new_user_meta) })
        .where('id = :id', { id: getUserByEmail.id })
        .execute();

      return getUserByEmail;
    }

    let created = await this.create(user);
    created = { ...created, user_meta: JSON.parse(created.user_meta) };

    return created;
  }
}
