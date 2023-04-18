import {
  Controller,
  Post,
  Body,
  Get,
  ClassSerializerInterceptor,
  UseInterceptors,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { AuthUserDto, AuthReturnDto } from './dto/auth-user.dto';
import { User } from './entities/user.entity';
import { AuthGuard } from 'src/guards/auth.guard';
import { GoogleSigninDto } from './dto/google-signin.dto';

@UseInterceptors(ClassSerializerInterceptor)
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/authenticate')
  authenticate(@Body() authUserDto: AuthUserDto): Promise<AuthReturnDto> {
    return this.userService.authenticate(authUserDto);
  }

  @Get('/get-all-users')
  @UseGuards(AuthGuard)
  getAllUsers(): Promise<User[]> {
    return this.userService.getAllUsers();
  }

  @Post('/signin-with-google')
  signinWithGoogle(
    @Body() googleSigninDto: GoogleSigninDto,
  ): Promise<AuthReturnDto> {
    return this.userService.signinWithGoogle(googleSigninDto);
  }
}
