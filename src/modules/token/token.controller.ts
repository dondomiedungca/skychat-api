import { Controller, Post, Headers } from '@nestjs/common';
import { TokenService } from './token.service';
import { User } from '../user/entities/user.entity';
import { GeneratedTokenReturnDto } from './dto/generated-token-return.dto';

@Controller('token')
export class TokenController {
  constructor(private readonly tokenService: TokenService) {}

  @Post('/validate-access-token')
  validateAccessToken(
    @Headers('authorization') headers,
  ): Promise<User | undefined> {
    return this.tokenService.validateAccessToken(headers);
  }

  @Post('/refresh-token')
  refreshToken(
    @Headers('authorization') headers,
  ): Promise<Partial<GeneratedTokenReturnDto>> {
    return this.tokenService.validateRefreshToken(headers);
  }
}
