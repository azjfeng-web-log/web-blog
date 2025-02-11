import { Injectable } from '@nestjs/common';
import { BlogsConfig } from './blogs.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class BlogsService {
  constructor(
    @InjectRepository(BlogsConfig)
    private BlogsRepository: Repository<BlogsConfig>,
  ) {}

  async findAll(): Promise<any> {
    return await this.BlogsRepository.find();
  }

  async findOne(id: number): Promise<any> {
    return await this.BlogsRepository.findOne({
      where: { id },
    });
  }

  async create(body: any): Promise<any> {
    return await this.BlogsRepository.save(body);
  }
}
