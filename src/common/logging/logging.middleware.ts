import { Injectable, NestMiddleware } from '@nestjs/common';
import {NextFunction} from "express";

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log(`Incoming Request: ${req.method} ${req.url} ${req.body}`);
    next();
  }
}
