import {
  createParamDecorator,
  ExecutionContext,
  ValidationPipe,
} from '@nestjs/common';
import { Request } from 'express';
import { validationPipeExceptionFactory } from '../validation/validaiton-pipe.exception-factory';

const PaginationQueryDecorator = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();
    return request.query;
  },
);

export const PaginationQuery = () =>
  PaginationQueryDecorator(
    new ValidationPipe({
      transform: true,
      validateCustomDecorators: true,
      exceptionFactory: validationPipeExceptionFactory,
    }),
  );
