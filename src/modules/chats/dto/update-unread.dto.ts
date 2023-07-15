import { IsNotEmpty } from 'class-validator';

export class UpdateUnreadDto {
  @IsNotEmpty()
  conversation_id?: string;

  @IsNotEmpty()
  user_id: string;
}
