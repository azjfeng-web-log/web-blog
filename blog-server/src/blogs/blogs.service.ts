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
    const bgUrl = body.bg_url;
    // 移除 Base64 URL 的前缀（如果有）
    const pureBase64Data = bgUrl.split(',')[1];
    body.bg_url = pureBase64Data;
    return await this.BlogsRepository.save(body);
  }
}
