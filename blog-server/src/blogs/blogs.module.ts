import { Module } from '@nestjs/common';
import { BlogsController } from './blogs.controller';
import { BlogsService } from './blogs.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlogsConfig } from './blogs.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BlogsConfig])],
  controllers: [BlogsController],
  providers: [BlogsService]
})
export class BlogsModule {}
