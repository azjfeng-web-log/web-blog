import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ArgumentsHost, Catch, ExceptionFilter, ValidationPipe } from '@nestjs/common';
import { json, text, urlencoded } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    
    console.error('[Error Details]:', {
      message: exception.message,
      stack: exception.stack,
    });

    response.status(401).json({
      status: 401,
      message: 'Server-side error occurred. Contact support.',
    });
  }
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 优先设置 Body 解析中间件
  app.use(json({ limit: '100mb' }));
  app.use(text());
  app.use(urlencoded({ extended: true, limit: '100mb' }));

  // 全局管道和过滤器
  // app.useGlobalPipes(
  //   new ValidationPipe({
  //     whitelist: true,
  //     forbidNonWhitelisted: true,
  //     transform: true,
  //   })
  // );
  // app.useGlobalFilters(new AllExceptionsFilter());

  await app.listen(3000);
}
bootstrap();