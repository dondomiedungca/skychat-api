import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Role } from './role.entity';
import { Exclude } from 'class-transformer';

@Entity({ name: 'users' })
export class User {
  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'first_name' })
  firstName: string;

  @Column({ name: 'last_name' })
  lastName: string;

  @Column({ name: 'email' })
  email: string;

  @Column({ name: 'google_id' })
  googleId: string;

  @Column({ name: 'picture' })
  picture: string;

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
}
