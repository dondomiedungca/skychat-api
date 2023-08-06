import { IsNotEmpty, IsString, IsEmail } from 'class-validator';

export class UserNotificationDto {
  @IsNotEmpty()
  @IsString()
  user_id: string;

  @IsNotEmpty()
  @IsString()
  token: string;
}
