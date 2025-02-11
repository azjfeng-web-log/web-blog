import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { json, urlencoded, text } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 设置全局请求体大小限制
  app.useGlobalPipes(new ValidationPipe());
  // app.use(json({ limit: '50mb' }));
  app.use(text());
  // app.use(urlencoded({ extended: true, limit: '50mb' }));
  await app.listen(3000);
}
bootstrap();