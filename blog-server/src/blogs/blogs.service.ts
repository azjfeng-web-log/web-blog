import { Injectable } from '@nestjs/common';
import { BlogsConfig } from './blogs.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

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
    const t_data = {...body};
    t_data.created_at = new Date().toLocaleString();
    t_data.link_id = uuidv4();
    return await this.BlogsRepository.save(t_data);
  }
}
