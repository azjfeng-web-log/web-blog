import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpStatus,
    UnauthorizedException,
  } from '@nestjs/common';
  import { Response } from 'express';
  
  @Catch(UnauthorizedException)
  export class CustomUnauthorizedExceptionFilter implements ExceptionFilter {
    catch(exception: UnauthorizedException, host: ArgumentsHost) {
      const ctx = host.switchToHttp();
      const response = ctx.getResponse<Response>();
      const status = HttpStatus.OK; // 你想要返回的状态码
  
      response.status(status);
    }
  }