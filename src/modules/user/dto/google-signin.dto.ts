import { IsNotEmpty, IsString, IsEmail } from 'class-validator';

export class GoogleSigninDto {
  @IsNotEmpty()
  @IsString()
  token: string;
}
