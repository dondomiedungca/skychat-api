import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from 'src/modules/user/entities/user.entity';
import { Conversation } from './conversation.entity';

@Entity({ name: 'users_conversations' })
export class UsersConversations {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'display_name' })
  display_name: string;

  @OneToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToOne(() => User)
  @JoinColumn({ name: 'related_to' })
  related_to: User;

  @ManyToOne(
    () => Conversation,
    (conversation) => conversation.users_conversations,
  )
  @JoinColumn({ name: 'conversation_id' })
  conversation: Conversation;

  @Column()
  deleted_at: Date;
}
