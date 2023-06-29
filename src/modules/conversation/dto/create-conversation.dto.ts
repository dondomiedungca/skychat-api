import { IsNotEmpty, IsOptional } from 'class-validator';
import { Chat } from 'src/modules/chats/entities/chat.entity';
import { User } from 'src/modules/user/entities/user.entity';
import { ConversationMeta } from '../entities/conversation.entity';

export class CreateConversationDto {
  @IsOptional()
  conversation_id?: number;

  @IsNotEmpty()
  parties: string[];

  @IsNotEmpty()
  msg: any;
}

export interface CreateConversation {
  type: 'personal' | 'group';
  conversation_meta: ConversationMeta;
  created_at: Date;
  updated_at: Date;
  users?: User[];
  chats?: Chat[];
}
