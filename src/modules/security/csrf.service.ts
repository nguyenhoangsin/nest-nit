import { Injectable } from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class CsrfService {
  generateCsrfToken(req: Request): string {
    const csrfToken: string = (req as any).csrfToken();

    return csrfToken;
  }
}
