import { Injectable } from '@nestjs/common';
import { CreateTokenDto } from './dto/create-token.dto';
import { UpdateTokenDto } from './dto/update-token.dto';
import * as crypto from 'crypto';
import * as fs from 'fs';
import { ConfigService } from '../base/config/config.service';

@Injectable()
export class TokenService {
  constructor(private readonly configService: ConfigService) {}

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

  getPrivatekey(): string {
    const environment: string = this.configService.get('environment');
    return fs.readFileSync(
      __dirname +
        `/../../../configurations/keys/private.${environment}.key.pem`,
      { encoding: 'utf8' },
    );
  }

  generateHash(payload: any): string {
    const secret = this.getPrivatekey();

    const hmac = crypto
      .createHmac('sha256', secret)
      .update(payload)
      .digest('hex');

    return hmac;
  }
}
