import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity({ name: 'user_notification_tokens' })
export class UserNotificationTokens {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.notificationTokens)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column()
  device_unique_id?: string;

  @Column()
  token: string;

  @Column()
  deleted_at?: Date;

  @Column()
  created_at: Date;
}
