import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { ErrorApiResponse } from './error-api-response.dto';
import { ErrorCode } from './error-code';
import { ValidationException } from './validation/validation.exception';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    this.logger.error(exception);

    // In certain situations `httpAdapter` might not be available in the
    // constructor method, thus we should resolve it here.
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();

    let httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
    let responseBody: ErrorApiResponse = {
      code: ErrorCode.INTERNAL_SERVER_ERROR,
      title: 'Something unexpected happened',
    };

    switch (true) {
      case exception instanceof ValidationException:
        responseBody = this.fromValidationException(exception);
        httpStatus = HttpStatus.BAD_REQUEST;
        break;
      case exception instanceof NotFoundException:
        responseBody = this.fromNotFoundException(exception);
        httpStatus = HttpStatus.NOT_FOUND;
        break;
    }

    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }

  private fromValidationException(
    error: ValidationException,
  ): ErrorApiResponse {
    return {
      code: ErrorCode.VALIDATION_ERROR,
      title: 'Validation failed',
      errors: error.errors.map((e) => ({ field: e.field, detail: e.message })),
    };
  }

  private fromNotFoundException(error: NotFoundException): ErrorApiResponse {
    return {
      code: ErrorCode.NOT_FOUND,
      title: error.message,
    };
  }
}
