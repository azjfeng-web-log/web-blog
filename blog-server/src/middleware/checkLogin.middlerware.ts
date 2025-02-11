
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { getCookie } from 'src/shared/utils';

@Injectable()
export class CheckLoginMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const cookie = req.headers.cookie;
    const token = getCookie(cookie || '', 'token');
    req.headers.authorization = `Bearer ${token}`;
    next();
  }
}
