import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import * as moment from 'moment-timezone';
import { EventEmitter2 } from '@nestjs/event-emitter';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { ConfigService } from '../base/config/config.service';
import { UserRepository } from './user.repository';
import { TokenType } from './../../types/config.type';
import { TokenService } from '../token/token.service';
import { TokenRepository } from '../token/token.repository';
import { Role } from './entities/role.entity';

@Injectable()
export class UserService {
  constructor(
    private eventEmitter: EventEmitter2,
    private readonly userRepository: UserRepository,
    private readonly tokenRepository: TokenRepository,
    private readonly configService: ConfigService,
    private readonly tokenService: TokenService,
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
    role: string,
  ): Promise<void> {
    const tokenConfig: TokenType = this.configService.get('token');

    const salt = bcrypt.genSaltSync(tokenConfig.saltRound);
    const hash = bcrypt.hashSync(user.password, salt);

    const selectedRole = await this.userRepository.getRole(role);

    const data: Partial<User> = {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      password: hash,
      roles: [selectedRole],
      verified_at: moment.utc().toDate(),
      created_at: moment.utc().toDate(),
      updated_at: moment.utc().toDate(),
    };

    await this.userRepository.create(data);
  }
}
