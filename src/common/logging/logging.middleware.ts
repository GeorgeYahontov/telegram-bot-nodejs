import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
    //LoggingMiddleware
export class LoggingMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const requestBody = JSON.stringify(req.body, null, 2);
    console.log(`Incoming Request: ${req.method} ${req.url} Body: ${requestBody}`);
    next();
  }
}
