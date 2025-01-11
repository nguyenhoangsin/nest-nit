import { Module } from '@nestjs/common';
import { SecurityController } from './security.controller';
import { CsrfService } from './csrf.service';

@Module({
  controllers: [SecurityController],
  providers: [CsrfService],
  exports: [CsrfService],
})
export class SecurityModule {}
