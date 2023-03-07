import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export const Jwt = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    return req.jwt;
  },
);
