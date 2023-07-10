import { Conversation } from 'src/modules/conversation/entities/conversation.entity';
import { User } from 'src/modules/user/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

export interface ConversationMeta {
  type: 'personal' | 'group';
  parties_id: string[];
  parties_name: string[];
}

@Entity({ name: 'chats' })
export class Chat {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Conversation, (conversation) => conversation.chats)
  @JoinColumn({ name: 'conversation_id' })
  conversation: Conversation;

  @Column()
  text: string;

  @Column({ name: 'chat_meta' })
  chat_meta: string;

  @Column({ name: 'readed_at' })
  readed_at?: Date;

  @Column({ name: 'deleted_at' })
  deleted_at?: Date;

  @OneToOne(() => User, { eager: true })
  deleted_by: User;
}
