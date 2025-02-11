import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { IsOptional } from 'class-validator';

@Entity('t_blogs')
export class BlogsConfig {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  linkId: string;

  @Column()
  author: string;

  @Column()
  title: string;

  @Column()
  @IsOptional()
  description: string;

  @Column()
  @IsOptional()
  content: string;

  @Column()
  @IsOptional()
  image: string;

  @Column({default: 0})
  commentNum: number;

  @Column({default: 0})
  viewNum: number;

  @Column({default: 0})
  likeNum: number;

  @Column({default: 0})
  dislikeNum: number;

  @Column({ default: '' })
  createTime: string;

  @Column({ default: '' })
  updateTime: string;

  @Column({ default: '' })
  createUser: string;

  @Column({ default: '' })
  updateUser: string;
}
