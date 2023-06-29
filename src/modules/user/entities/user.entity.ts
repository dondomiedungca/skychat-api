import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
  OneToMany,
} from 'typeorm';
import { Role } from './role.entity';
import { Exclude } from 'class-transformer';
import { Conversation } from 'src/modules/conversation/entities/conversation.entity';
import { Chat } from 'src/modules/chats/entities/chat.entity';

export interface UserActivity {
  showActivity?: boolean;
  isActive?: boolean;
  lastActive?: Date;
}

export interface UserMeta {
  google_id?: string;
  profile_photo?: string;
  activity?: UserActivity;
}

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'first_name' })
  firstName: string;

  @Column({ name: 'last_name' })
  lastName: string;

  @Column({ name: 'email' })
  email: string;

  @Column({ name: 'user_meta' })
  user_meta?: string;

  @Column({ name: 'password' })
  @Exclude({ toPlainOnly: true })
  password?: string;

  @Column()
  created_at: Date;

  @Column()
  updated_at: Date;

  @Column()
  verified_at?: Date;

  @Column()
  is_deleted?: Boolean;

  @Column()
  deleted_at?: Date;

  @ManyToMany(() => Role, { onDelete: 'CASCADE', eager: true })
  @JoinTable({
    name: 'user_role',
    joinColumn: {
      name: 'user_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'role_id',
      referencedColumnName: 'id',
    },
  })
  roles: Role[];

  @ManyToMany(() => Conversation, (conversation) => conversation.users, {
    onDelete: 'SET NULL',
    eager: false,
  })
  @JoinTable({
    name: 'users_conversations',
    joinColumn: {
      name: 'user_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'conversation_id',
      referencedColumnName: 'id',
    },
  })
  conversations: Conversation[];

  @OneToMany(() => Chat, (chat) => chat.user)
  chats: Chat[];
}
