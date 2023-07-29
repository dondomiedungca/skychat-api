import { GoogleSigninDto } from './dto/google-signin.dto';
import { AuthReturnDto, AuthUserDto } from './dto/auth-user.dto';
import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import * as moment from 'moment-timezone';
import { EventEmitter2 } from '@nestjs/event-emitter';
import axios from 'axios';

import { User, UserMeta } from './entities/user.entity';
import { ConfigService } from '../base/config/config.service';
import { UserRepository } from './user.repository';
import { TokenType } from './../../types/config.type';
import { TokenService } from '../token/token.service';
import { TokenRepository } from '../token/token.repository';
import { GeneratedTokenReturnDto } from '../token/dto/generated-token-return.dto';
import { DataSource } from 'typeorm';
import { RolesType } from 'src/types/roles.type';
import { JWTDecodeDto } from '../token/dto/jwt-decoded.dto';
import jwtDecode from 'jwt-decode';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { Token } from '../token/entities/token.entity';
import { JwtPayload } from 'jsonwebtoken';
import { Conversation } from '../conversation/entities/conversation.entity';
import { PhoneSigninDto } from './dto/phone-signin.dto';
import { Activations } from '../token/entities/activations.entity';
import { TypeVerification, VerifyDto } from './dto/verify.dto';

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
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      password: hash,
      roles: [selectedRole],
      verified_at: moment.utc().toDate(),
      created_at: moment.utc().toDate(),
      updated_at: moment.utc().toDate(),
    };

    await this.userRepository.create(data);
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

  async getUsersExceptMe({
    search,
    page = 1,
    currentUser,
  }: {
    search?: string;
    page: number;
    currentUser: JwtPayload;
  }) {
    const take = 10;
    const skip = (page - 1) * take;

    return this.connection
      .createQueryBuilder(User, 'users')
      .leftJoinAndSelect(
        'users.users_conversations',
        'uc',
        'uc.related_to = :currentUserId',
        { currentUserId: currentUser.sub },
      )
      .leftJoinAndSelect('uc.conversation', 'conversation')
      .where('users.id != :id', { id: currentUser.sub })
      .orderBy('users.created_at', 'DESC')
      .take(take)
      .skip(skip)
      .getMany();
  }

  async signinWithGoogle({ token }: GoogleSigninDto): Promise<AuthReturnDto> {
    const response = await axios.get(
      'https://www.googleapis.com/userinfo/v2/me',
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );

    if (response.status === 200) {
      const role = await this.userRepository.getRole(RolesType.NORMAL_USER);

      const user: Partial<User> = {
        first_name: response.data.given_name,
        last_name: response.data.family_name,
        email: response.data.email,
        user_meta: JSON.stringify({
          activity: {
            show_activity: true,
            last_active: moment.utc().toDate(),
            is_active: true,
          },
          profile_photo: response.data.picture,
          google_id: response.data.id,
        }),
        roles: [role],
        verified_at: moment.utc().toDate(),
        created_at: moment.utc().toDate(),
        updated_at: moment.utc().toDate(),
      };

      const createdUser = await this.userRepository.findOrCreate(user, [
        'email',
        {
          type: 'JSON',
          condition: '=',
          column: 'user_meta',
          property: 'google_id',
          value: response.data.id,
          valueType: 'numeric',
        },
      ]);

      const generatedToken: GeneratedTokenReturnDto =
        await this.tokenService.generateAuthToken(createdUser);

      return generatedToken;
    }

    throw new HttpException(
      "Error on getting user's primary google information",
      HttpStatus.FORBIDDEN,
    );
  }

  async signinWithPhone(phoneSigninDto: PhoneSigninDto): Promise<boolean> {
    const { phone_number } = phoneSigninDto;
    const checkNumber = await this.connection
      .createQueryBuilder(Activations, 'activation')
      .where('activation.phone_number = :phone_number', { phone_number })
      .orderBy('activation.id', 'DESC')
      .getOne();

    if (!checkNumber) {
      /**
       * Create new activation with new code
       */
      const activation = new Activations();
      activation.phone_number = phone_number;
      activation.code = Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;
      this.connection.manager.save(activation);
      /**
       * TODO send new sms in here
       */
    } else {
      const newCode = Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;

      checkNumber.code = newCode;
      this.connection.manager.save(checkNumber);

      /**
       *TODO Now send new sms in here
       */
    }

    return true;
  }

  async verifyCode(
    verifyDto: VerifyDto,
  ): Promise<{ is_verified: boolean; authTokens?: AuthReturnDto }> {
    const { type, email, phone_number, code } = verifyDto;

    const checkVerification = await this.connection
      .createQueryBuilder(Activations, 'activations')
      .leftJoinAndSelect('activations.user', 'user')
      .where(
        `${
          type === TypeVerification.EMAIL
            ? 'activations.email'
            : 'activations.phone_number'
        } = :category AND activations.code = :code`,
        {
          category: type === TypeVerification.EMAIL ? email : phone_number,
          code,
        },
      )
      .getOne();

    if (!checkVerification) {
      return {
        is_verified: false,
      };
    }

    let tokens: AuthReturnDto | undefined = undefined;

    if (checkVerification?.user) {
      tokens = await this.tokenService.generateAuthToken(
        checkVerification.user,
      );
    }

    return {
      is_verified: true,
      authTokens: tokens,
    };
  }

  async handleLogout({ refreshToken }: RefreshTokenDto): Promise<boolean> {
    const token = refreshToken;
    try {
      const hashed_token = crypto
        .createHmac('sha256', this.tokenRepository.getPrivatekey())
        .update(token)
        .digest('hex');

      const isFound = await this.tokenRepository.findByHashed(hashed_token);

      if (isFound) {
        const isValid = this.tokenService.verifyToken(token);

        if (!isValid) {
          throw { message: 'Error: JWT expired' };
        }

        const decoded: JWTDecodeDto = jwtDecode(token);

        const user = await this.userRepository.findById(decoded?.sub);

        if (user) {
          const old_meta = user?.user_meta as unknown as UserMeta;
          const new_user_meta = {
            ...(old_meta || {}),
            activity: {
              ...old_meta?.activity,
              last_active: moment.utc().toDate(),
              is_active: false,
            },
          };

          this.connection
            .getRepository(User)
            .createQueryBuilder('users')
            .update(User)
            .set({ user_meta: JSON.stringify(new_user_meta) })
            .where('id = :id', { id: user.id })
            .execute();

          this.connection
            .getRepository(Token)
            .createQueryBuilder('tokens')
            .delete()
            .from(Token)
            .where(
              'tokens.user_id = :user_id AND tokens.hashed_token = :hashed_token',
              {
                user_id: user.id,
                hashed_token,
              },
            )
            .execute();

          return true;
        }
        return false;
      }
    } catch (error) {
      console.log(error);
      throw new HttpException(
        'refresh token is not valid, either expired or really invalid',
        HttpStatus.FORBIDDEN,
      );
    }
  }
}
