import {
  Controller,
  Post,
  Body,
  Get,
  ClassSerializerInterceptor,
  UseInterceptors,
  UseGuards,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { AuthUserDto, AuthReturnDto, CheckEmailDto } from './dto/auth-user.dto';
import { User } from './entities/user.entity';
import { AuthGuard } from 'src/guards/auth.guard';
import { GoogleSigninDto } from './dto/google-signin.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { CurrentUser } from 'src/decorators/user.decorator';
import { JwtPayload } from 'jsonwebtoken';
import { PhoneSigninDto } from './dto/phone-signin.dto';
import { VerifyDto } from './dto/verify.dto';
import { OnBoardingDataDto } from './dto/complete-onboarding.dto';
import { UserNotificationDto } from './dto/user-notification.dto';

@UseInterceptors(ClassSerializerInterceptor)
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/authenticate')
  authenticate(@Body() authUserDto: AuthUserDto): Promise<AuthReturnDto> {
    return this.userService.authenticate(authUserDto);
  }

  @Get('/get-users/except-me')
  @UseGuards(AuthGuard)
  getAllUsers(
    @CurrentUser() currentUser: JwtPayload,
    @Query('page') page: number,
    @Query('search') search?: string,
  ): Promise<User[]> {
    return this.userService.getUsersExceptMe({ search, page, currentUser });
  }

  @Post('/signin-with-google')
  signinWithGoogle(
    @Body() googleSigninDto: GoogleSigninDto,
  ): Promise<AuthReturnDto> {
    return this.userService.signinWithGoogle(googleSigninDto);
  }

  @Post('/signin-with-phone')
  signinWithPhone(@Body() phoneSigninDto: PhoneSigninDto): Promise<boolean> {
    return this.userService.signinWithPhone(phoneSigninDto);
  }

  @Post('/verified-code')
  verifiedCode(
    @Body() verifyDto: VerifyDto,
  ): Promise<{ is_verified: boolean; authTokens?: AuthReturnDto }> {
    return this.userService.verifyCode(verifyDto);
  }

  @Post('/complete-onboarding')
  completeOnboarding(
    @Body() completeOnboardingDto: OnBoardingDataDto,
  ): Promise<{ is_success: boolean; authTokens?: AuthReturnDto }> {
    return this.userService.completeOnboarding(completeOnboardingDto);
  }

  @Post('/check-email-if-exists')
  checkEmailIfExist(
    @Body() checkEmail: CheckEmailDto,
  ): Promise<{ is_exists: boolean }> {
    return this.userService.checkEmail(checkEmail);
  }

  @Post('/handle-logout')
  @UseGuards(AuthGuard)
  handleLogout(@Body() refreshTokenDto: RefreshTokenDto): Promise<boolean> {
    return this.userService.handleLogout(refreshTokenDto);
  }

  @Post('/set-notification')
  @UseGuards(AuthGuard)
  setNotification(
    @Body() userNotificationDto: UserNotificationDto,
  ): Promise<boolean> {
    return this.userService.setNotification(userNotificationDto);
  }
}
