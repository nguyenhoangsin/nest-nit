import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const Cookies = createParamDecorator((data: string, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  // If 'data' is provided, return the specific cookie, otherwise return all cookies
  return data ? request.cookies?.[data] : request.cookies;
});
