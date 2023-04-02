import { AuthReturnDto, AuthUserDto } from './dto/auth-user.dto';
import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import * as moment from 'moment-timezone';
import { EventEmitter2 } from '@nestjs/event-emitter';

import { User } from './entities/user.entity';
import { ConfigService } from '../config/config.service';
import { UserRepository } from './user.repository';
import { TokenType } from './../../types/config.type';
import { TokenService } from '../token/token.service';
import { TokenRepository } from '../token/token.repository';
import { GeneratedTokenReturnDto } from '../token/dto/generated-token-return.dto';
import { DataSource } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @Inject('CONNECTION') private readonly connection: DataSource,
    private eventEmitter: EventEmitter2,
    private readonly userRepository: UserRepository,
    private readonly tokenRepository: TokenRepository,
    private readonly configService: ConfigService,
    private readonly tokenService: TokenService,
  ) {}

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
      created_at: moment.utc().toDate(),
      updated_at: moment.utc().toDate(),
    };

    const hashed = this.tokenService.generateHash(user.email);

    const payload = {
      email: user.email,
      hash: hashed,
    };

    const createdUser = await this.userRepository.create(data);
    await this.tokenRepository.saveHash(hashed, createdUser, createdUser.email);

    this.eventEmitter.emit('command.user.created', payload);
  }

  async authenticate(authUserDto: AuthUserDto): Promise<AuthReturnDto> {
    const attemptedUser = await this.userRepository.findByEmail(
      authUserDto.email,
    );

    if (attemptedUser) {
      if (!attemptedUser.verified_at) {
        throw new HttpException(
          'User is not yet verified',
          HttpStatus.FORBIDDEN,
        );
      }

      const isMatch = await bcrypt.compare(
        authUserDto.password,
        attemptedUser.password,
      );

      if (isMatch) {
        const generatedToken: GeneratedTokenReturnDto =
          await this.tokenService.generateAuthToken(attemptedUser);

        return generatedToken;
      }
    }

    throw new HttpException('Incorrect credentials', HttpStatus.FORBIDDEN);
  }

  async getAllUsers(): Promise<User[]> {
    return this.connection
      .getRepository(User)
      .createQueryBuilder('roles')
      .getMany();
  }
}
