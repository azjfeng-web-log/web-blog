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
  async uploadFile(@UploadedFile() file: Express.Multer.File, @Req() req: Request) {
    const origin = (req.headers as any).origin;
    console.log('origin', origin);
    return {
      message: 'success',
      status: 0,
      data: {
        url: `${origin}/static/${file.path}`, // 动态URL构造
        meta: file.originalname
      }
    };
  }
}
