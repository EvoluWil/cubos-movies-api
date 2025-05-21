import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { User } from 'src/@types/user.type';
import { defaultPlainToClass } from 'src/utils/default-plain-to-class';

export const AuthUser = createParamDecorator(
  (_data, ctx: ExecutionContext): User => {
    const request = ctx.switchToHttp().getRequest();

    return defaultPlainToClass(User, request.user);
  },
);
