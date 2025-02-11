import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { IsOptional } from 'class-validator';

@Entity('t_blogs')
export class BlogsConfig {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({default: 0})
  linkId: number;

  @Column()
  author: string;

  @Column('longtext')
  avatar_url: string;

  @Column()
  title: string;

  @Column()
  @IsOptional()
  description: string;

  @Column()
  @IsOptional()
  content: string;

  @Column({ default: 0 })
  view_num: number;

  @Column('longtext')
  @IsOptional()
  bg_url: string;

  @Column({ default: '' })
  created_at: string;
}
