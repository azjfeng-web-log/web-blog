import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('t_users')
export class UsersConfig {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  account: string;

  @Column()
  password: string;
}
