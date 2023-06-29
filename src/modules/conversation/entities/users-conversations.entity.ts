import {
  Column,
  Entity,
  JoinColumn,
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

  @OneToOne(() => User, {
    eager: true,
  })
  @JoinColumn({ name: 'user_id' })
  public user: User;

  @OneToOne(() => User, {
    eager: true,
  })
  @JoinColumn({ name: 'conversation_id' })
  public conversation: Conversation;

  @Column()
  deleted_at: Date;
}
