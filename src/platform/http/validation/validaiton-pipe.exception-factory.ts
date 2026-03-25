import { ValidationError } from '@nestjs/common';
import { ValidationException } from './validation.exception';

export function validationPipeExceptionFactory(
  errors: ValidationError[],
): ValidationException {
  const ex = new ValidationException();
  errors.forEach((err) => mapError(err, ex.errors));
  return ex;
}

function mapError(err: ValidationError, result: ValidationException['errors']) {
  if (err.constraints) {
    Object.values(err.constraints).forEach((message) => {
      result.push({
        field: err.property,
        message,
      });
    });
  }

  err.children?.forEach((child) => mapError(child, result));
}
