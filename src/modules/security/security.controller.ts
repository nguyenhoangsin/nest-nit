import { Controller, Get, Req } from '@nestjs/common';
import { Request } from 'express';
import { CsrfService } from './csrf.service';

@Controller('security')
export class SecurityController {
  constructor(private readonly csrfService: CsrfService) {}

  @Get('csrf-token')
  getCsrfToken(@Req() req: Request): { csrfToken: string } {
    const csrfToken: string = this.csrfService.generateCsrfToken(req);
    return { csrfToken };
  }
}
