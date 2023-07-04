import { Chat } from 'src/modules/chats/entities/chat.entity';
import { User } from 'src/modules/user/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UsersConversations } from './users-conversations.entity';

export interface ConversationMeta {
  type: 'personal' | 'group';
  parties_id: string[];
  parties_name: string[];
}

@Entity({ name: 'conversations' })
export class Conversation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'type' })
  type: string;

  @Column({ name: 'conversation_meta' })
  conversation_meta: string | null;

  @ManyToMany(() => User, (user) => user.conversations)
  users?: User[];

  @OneToMany(() => Chat, (chat) => chat.conversation)
  chats?: Chat[];

  @OneToMany(
    () => UsersConversations,
    (usersConversations) => usersConversations.conversation,
  )
  @JoinColumn({ name: 'conversation_id' })
  users_conversations: UsersConversations;

  @Column()
  created_at: Date;

  @Column()
  updated_at: Date;
}
