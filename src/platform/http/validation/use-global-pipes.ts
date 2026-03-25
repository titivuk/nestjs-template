import { INestApplication, ValidationPipe } from '@nestjs/common';
import { validationPipeExceptionFactory } from './validaiton-pipe.exception-factory';

export function useGlobalPipes(app: INestApplication) {
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidUnknownValues: false,
      transform: true,
      stopAtFirstError: false,
      exceptionFactory: validationPipeExceptionFactory,
    }),
  );
}
