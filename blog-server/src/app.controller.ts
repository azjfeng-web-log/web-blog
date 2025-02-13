import { Controller, Get, Post, Req, UploadedFile, UseInterceptors } from '@nestjs/common';
import { AppService } from './app.service';
import { Public } from './auth/decorators/public.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { existsSync, mkdirSync } from 'fs';
import { localDiskConfig } from './shared/storage.config';


@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Public()
  @Get('hello')
  getHello(): string {
    return this.appService.getHello();
  }

  @Public()
  @Post('upload/file')
  @UseInterceptors(FileInterceptor('file', localDiskConfig)) // 'file' 对应前端的字段名
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    return {
      message: 'success',
      status: 0,
      data: {
        url: `http://127.0.0.1:3000/static/${file.path}`, // 动态URL构造
        meta: file.originalname
      }
    };
  }
}
