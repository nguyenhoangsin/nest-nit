import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class SessionLoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger(SessionLoggerMiddleware.name);

  use(req: Request, res: Response, next: NextFunction) {
    if (req.session) {
      this.logger.log(`${JSON.stringify(req.session)}`);
    }
    next();
  }
}
