import { IsNotEmpty, IsOptional } from 'class-validator';

export interface MessageOwner {
  _id: string | number;
  name?: string;
  avatar?: string | number;
}

export interface IMessage {
  _id: string | number;
  text: string;
  createdAt: Date | number;
  user: MessageOwner;
  image?: string;
  video?: string;
  audio?: string;
  system?: boolean;
  sent?: boolean;
  received?: boolean;
  pending?: boolean;
  quickReplies?: any;
}

export class CreateChatDto {
  @IsOptional()
  conversation_id?: number;

  @IsNotEmpty()
  parties: string[];

  @IsNotEmpty()
  msg: IMessage;
}
