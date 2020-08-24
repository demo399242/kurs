import { createParamDecorator } from '@nestjs/common';

export const AuthUser = createParamDecorator(
  (data, req) => req.user || req.args[0].user
)


