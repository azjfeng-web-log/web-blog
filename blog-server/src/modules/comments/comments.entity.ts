import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { IsOptional } from 'class-validator';

@Entity('t_comments')
export class CommentsConfig {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  post_id: number;

  @Column()
  user_id: number;

  @Column()
  parent_comment_id: number;

  @Column()
  content: string;

  @Column({ default: 0 })
  likes_count: number;

  @Column({ default: 0 })
  dilikes_count: number;

  @Column({ default: 0 })
  deleted_flag: number;

  @Column({ default: '' })
  created_at: string;

  @Column({ default: '' })
  updated_at: string;
}
