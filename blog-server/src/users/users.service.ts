
import { Injectable } from '@nestjs/common';

import { UsersConfig } from './users.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

// This should be a real class/interface representing a user entity
export type User = any;

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersConfig)
    private UsersRepository: Repository<UsersConfig>,
  ) {}

  async findOne(username: string): Promise<User | undefined> {
    const user = await this.UsersRepository.findOne({ where: { account: username } });
    return user;
  }
}
