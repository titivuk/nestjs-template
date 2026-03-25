import { ValidationError } from '@nestjs/common';
import { validationPipeExceptionFactory } from '../../../../src/platform/http/validation/validaiton-pipe.exception-factory';
import { ValidationException } from '../../../../src/platform/http/validation/validation.exception';

describe('validationPipeExceptionFactory', () => {
  it('should return multiple errors for a property', () => {
    const validationErrors: ValidationError[] = [
      {
        property: 'foo',
        constraints: {
          int: 'should be integer',
          positive: 'should be positive',
        },
      },
    ];

    const exception = validationPipeExceptionFactory(validationErrors);

    expect(exception).toBeInstanceOf(ValidationException);
    expect(exception.errors).toStrictEqual([
      {
        field: 'foo',
        message: 'should be integer',
      },
      {
        field: 'foo',
        message: 'should be positive',
      },
    ]);
  });

  it('should handle multiple ValidationError', () => {
    const validationErrors: ValidationError[] = [
      {
        property: 'foo',
        constraints: {
          foo: 'should be foo',
        },
      },
      {
        property: 'bar',
        constraints: {
          bar: 'should be bar',
        },
      },
    ];

    const exception = validationPipeExceptionFactory(validationErrors);

    expect(exception).toBeInstanceOf(ValidationException);
    expect(exception.errors).toStrictEqual([
      {
        field: 'foo',
        message: 'should be foo',
      },
      {
        field: 'bar',
        message: 'should be bar',
      },
    ]);
  });

  it('should handle nested ValidationError', () => {
    const validationErrors: ValidationError[] = [
      {
        property: 'foo',
        constraints: {
          foo: 'should be foo',
        },
        children: [
          {
            property: 'bar',
            constraints: {
              bar: 'should be bar',
            },
          },
          {
            property: 'foobar',
            constraints: {
              foobar: 'should be foobar',
            },
          },
        ],
      },
    ];

    const exception = validationPipeExceptionFactory(validationErrors);

    expect(exception).toBeInstanceOf(ValidationException);
    expect(exception.errors).toStrictEqual([
      {
        field: 'foo',
        message: 'should be foo',
      },
      {
        field: 'bar',
        message: 'should be bar',
      },
      {
        field: 'foobar',
        message: 'should be foobar',
      },
    ]);
  });

  it('should handle nested ValidationError when parent is valid', () => {
    const validationErrors: ValidationError[] = [
      {
        property: 'foo',
        children: [
          {
            property: 'bar',
            constraints: {
              bar: 'should be bar',
            },
          },
        ],
      },
    ];

    const exception = validationPipeExceptionFactory(validationErrors);

    expect(exception).toBeInstanceOf(ValidationException);
    expect(exception.errors).toStrictEqual([
      {
        field: 'bar',
        message: 'should be bar',
      },
    ]);
  });
});
