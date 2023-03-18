import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import * as moment from 'moment-timezone';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { ConfigService } from '../config/config.service';
import { UserRepository } from './user.repository';
import { TokenType } from './../../types/config.type';
import { RolesType } from './../../types/roles.type';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly configService: ConfigService,
  ) {}

  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  findAll() {
    return `This action returns all user`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  async createUserFromCommand(
    user: Partial<User>,
    role: RolesType,
  ): Promise<void> {
    const tokenConfig: TokenType = this.configService.get('token');

    const salt = bcrypt.genSaltSync(tokenConfig.saltRound);
    const hash = bcrypt.hashSync(user.password, salt);

    const data: Partial<User> = {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      password: hash,
      created_at: moment.utc().toDate(),
      updated_at: moment.utc().toDate(),
    };

    await this.userRepository.create(data, role);
  }
}
