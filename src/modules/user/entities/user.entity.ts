import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

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

  @Column({ name: 'password' })
  password: string;

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
}
