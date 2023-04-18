import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import * as fs from 'fs';
import * as moment from 'moment-timezone';
import * as jwt from 'jsonwebtoken';

import { CreateTokenDto } from './dto/create-token.dto';
import { UpdateTokenDto } from './dto/update-token.dto';
import { ConfigService } from '../base/config/config.service';
import { User } from '../user/entities/user.entity';
import { GeneratedTokenReturnDto } from './dto/generated-token-return.dto';
import { TokenType } from 'src/types/config.type';
import { TokenRepository } from './token.repository';

@Injectable()
export class TokenService {
  private privateKey;
  private publicKey;

  constructor(
    private readonly configService: ConfigService,
    private readonly tokenRepository: TokenRepository,
  ) {
    this.privateKey = this.tokenRepository.getPrivatekey();
    this.publicKey = this.tokenRepository.getPublickey();
  }

  create(createTokenDto: CreateTokenDto) {
    return 'This action adds a new token';
  }

  findAll() {
    return `This action returns all token`;
  }

  findOne(id: number) {
    return `This action returns a #${id} token`;
  }

  update(id: number, updateTokenDto: UpdateTokenDto) {
    return `This action updates a #${id} token`;
  }

  remove(id: number) {
    return `This action removes a #${id} token`;
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
    const {
      exp: { access: configAccess, refresh: configRefresh },
    }: TokenType = this.configService.get('token');

    const payload = {
      iat: moment.utc().valueOf(),
      sub: user.id,
      email: user.email,
      roles: user.roles,
    };

    let refreshTokenExp = moment.utc();
    refreshTokenExp = refreshTokenExp.add({
      months: configRefresh.months,
      days: configRefresh.days,
      hours: configRefresh.hours,
      minutes: configRefresh.minutes,
    });

    let accessTokenExp = moment.utc();
    accessTokenExp = accessTokenExp.add({
      months: configAccess.months,
      days: configAccess.days,
      hours: configAccess.hours,
      minutes: configAccess.minutes,
    });

    const refreshToken = jwt.sign(payload, this.privateKey, {
      algorithm: 'RS256',
      expiresIn: refreshTokenExp.diff(moment.utc(), 'milliseconds'),
    });
    const accessToken = jwt.sign(payload, this.privateKey, {
      algorithm: 'RS256',
      expiresIn: accessTokenExp.diff(moment.utc(), 'milliseconds'),
    });

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
}
