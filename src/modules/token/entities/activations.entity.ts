import { User } from 'src/modules/user/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'activations' })
export class Activations {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => User, (user) => user.activation)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'user_id' })
  user_id?: string;

  @Column()
  email: string;

  @Column()
  hash: string;

  @Column()
  phone_number: string;

  @Column()
  code: number;
}
