import { Chat } from 'src/modules/chats/entities/chat.entity';
import { User } from 'src/modules/user/entities/user.entity';
import {
  Column,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

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

  @Column()
  created_at: Date;

  @Column()
  updated_at: Date;
}
