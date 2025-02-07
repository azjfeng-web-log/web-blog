
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { getCookie } from 'src/shared/utils';

@Injectable()
export class CheckLoginMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const token = getCookie(req.headers.cookie || '', 'token');
    req.headers.authorization = `Bearer ${token}`;
    console.log('Request...', req.headers.authorization);
    next();
  }
}
