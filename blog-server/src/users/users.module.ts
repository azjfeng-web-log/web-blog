
import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersConfig } from './users.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([UsersConfig])],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
