import { IsNotEmpty, IsOptional } from 'class-validator';
import { Chat } from '../entities/chat.entity';

export class CreateChatDto {
  @IsOptional()
  conversation_id?: string;

  @IsNotEmpty()
  parties: string[];

  @IsNotEmpty()
  payload: Partial<Chat>;
}
