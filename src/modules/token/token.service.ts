import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import * as moment from 'moment-timezone';
import * as jwt from 'jsonwebtoken';
import jwtDecode from 'jwt-decode';

import { UserRepository } from './../user/user.repository';
import { ConfigService } from '../base/config/config.service';
import { User } from '../user/entities/user.entity';
import { GeneratedTokenReturnDto } from './dto/generated-token-return.dto';
import { TokenType } from 'src/types/config.type';
import { TokenRepository } from './token.repository';
import { JWTDecodeDto } from './dto/jwt-decoded.dto';

@Injectable()
export class TokenService {
  private privateKey;
  private publicKey;

  constructor(
    private readonly configService: ConfigService,
    private readonly tokenRepository: TokenRepository,
    private readonly userRepository: UserRepository,
  ) {
    this.privateKey = this.tokenRepository.getPrivatekey();
    this.publicKey = this.tokenRepository.getPublickey();
  }

  generateHash(payload: any): string {
    const secret = this.tokenRepository.getPrivatekey();

    const hmac = crypto
      .createHmac('sha256', secret)
      .update(payload)
      .digest('hex');

    return hmac;
  }

  async generateAuthToken(user: User): Promise<GeneratedTokenReturnDto> {
    const payload = {
      iat: moment.utc().valueOf(),
      sub: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      roles: user.roles,
    };

    const refreshToken = this.generateRefreshToken(payload);

    const accessToken = this.generateAccessToken(payload);

    // save the refresh token for validating the token and generating new acccess token
    await this.tokenRepository.saveRefreshToken(refreshToken, user);

    return {
      accessToken,
      refreshToken,
    };
  }

  verifyToken(token: string) {
    return jwt.verify(token, this.publicKey, {
      clockTimestamp: moment.utc().valueOf(),
    });
  }

  async validateAccessToken(headers: string): Promise<User> {
    const token = headers?.split(' ')?.[1];
    try {
      const isValid = this.verifyToken(token);

      if (isValid) {
        const decoded: JWTDecodeDto = jwtDecode(token);
        const user = await this.userRepository.findById(decoded.sub);
        return user;
      }
    } catch (error) {
      throw new HttpException(
        'access token is not valid',
        HttpStatus.FORBIDDEN,
      );
    }
  }

  async validateRefreshToken(
    headers: string,
  ): Promise<Partial<GeneratedTokenReturnDto>> {
    const token = headers?.split(' ')?.[1];
    try {
      const hashed_token = crypto
        .createHmac('sha256', this.tokenRepository.getPrivatekey())
        .update(token)
        .digest('hex');

      const isFound = await this.tokenRepository.findByHashed(hashed_token);

      if (isFound) {
        const isValid = this.verifyToken(token);

        if (!isValid) {
          throw { message: 'Error: JWT expired' };
        }

        const decoded: JWTDecodeDto = jwtDecode(token);

        const user = await this.userRepository.findById(decoded?.sub);

        if (user) {
          // generate new access token
          const payload = {
            iat: moment.utc().valueOf(),
            sub: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            roles: user.roles,
          };

          const accessToken = this.generateAccessToken(payload);
          return { accessToken };
        }
      }
    } catch (error) {
      console.log(error);
      throw new HttpException(
        'refresh token is not valid, either expired or really invalid',
        HttpStatus.FORBIDDEN,
      );
    }
  }

  generateAccessToken(payload): string {
    const {
      exp: { access: configAccess },
    }: TokenType = this.configService.get('token');

    let accessTokenExp = moment.utc();
    accessTokenExp = accessTokenExp.add({
      months: configAccess.months,
      days: configAccess.days,
      hours: configAccess.hours,
      minutes: configAccess.minutes,
      seconds: configAccess.seconds,
    });

    const accessToken = jwt.sign(payload, this.privateKey, {
      algorithm: 'RS256',
      expiresIn: accessTokenExp.diff(moment.utc(), 'milliseconds'),
    });
    return accessToken;
  }

  generateRefreshToken(payload): string {
    const {
      exp: { refresh: configRefresh },
    }: TokenType = this.configService.get('token');

    let refreshTokenExp = moment.utc();
    refreshTokenExp = refreshTokenExp.add({
      months: configRefresh.months,
      days: configRefresh.days,
      hours: configRefresh.hours,
      minutes: configRefresh.minutes,
      seconds: configRefresh.seconds,
    });

    const refreshToken = jwt.sign(payload, this.privateKey, {
      algorithm: 'RS256',
      expiresIn: refreshTokenExp.diff(moment.utc(), 'milliseconds'),
    });

    return refreshToken;
  }
}
