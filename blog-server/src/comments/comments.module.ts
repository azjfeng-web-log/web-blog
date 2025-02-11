import { Module } from '@nestjs/common';
import { CommentService } from './comments.service';
import { CommentController } from './comments.controller';
import { CommentsConfig } from './comments.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([CommentsConfig])],
  providers: [CommentService],
  controllers: [CommentController]
})
export class CommentModule {}
