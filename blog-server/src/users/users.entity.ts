import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('t_users')
export class UsersConfig {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  account: string;

  @Column()
  password: string;

  @Column()
  avatar_url: string;

  @Column({default: ''})
  created_at: string;
}
