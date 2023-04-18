import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from 'src/modules/user/entities/user.entity';

@Entity({ name: 'tokens' })
export class Token {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @OneToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column()
  hashed_token: string;
}
