# NestJS API Design

## Pagination

`Pagination` and `PaginatedResult` are types used for pagination

```ts
/**
 * Pagination information
 */
export type Pagination = {
  page: number;
  perPage: number;
};

/**
 * Wrapper around paginated data
 */
export type PaginatedResult<T = unknown> = {
  page: number;
  perPage: number;
  total: number;
  totalPages: number;
  data: T[];
};
```

Additionally, for NestJS ecosystem corresponding DTOs are created

```ts
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, Min } from 'class-validator';
import { PaginatedResult, Pagination } from './paginated-result';

/**
 * DTO wrappers for Controllers. Provides
 * - validation
 * - openapi gen
 */

export class PaginatedResponseDto<T = unknown> implements PaginatedResult<T> {
  @ApiProperty({ minimum: 1 })
  page: number;

  @ApiProperty({ minimum: 1 })
  perPage: number;

  total: number;

  totalPages: number;

  @ApiProperty({ isArray: true })
  data: T[];
}

export class PaginationDto implements Pagination {
  @ApiProperty({ minimum: 1, description: 'Current page number' })
  @IsInt()
  @Min(1)
  @Type(() => Number)
  page: number = 1;

  @ApiProperty({ minimum: 1, description: 'Number of elements per page' })
  @IsInt()
  @Min(1)
  @Type(() => Number)
  perPage: number = 20;
}
```

Create a `PaginationQuery` custom decorator to extract query params:

```ts
// pagination-query.decorator.ts
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
```

When using custom decorator, use `ValidationPipe` to enable validation and transformation for custom decorators.

```ts
@PaginationQuery() // PaginationQuery decorator already has all properties for transformation and validation
pagination?: PaginationDto,
```

Make sure to provide these dtos to `SwaggerModule`

```ts
// main.ts
const document = SwaggerModule.createDocument(app, config, {
  extraModels: [PaginatedResponseDto, PaginationDto],
});
```

Add utility function to use `PaginatedResponseDto` with specific type

```ts
import { getSchemaPath } from '@nestjs/swagger';
import { PaginatedResponseDto } from './paginated-result.dto';

export function getPaginatedSchema(dto: Parameters<typeof getSchemaPath>[0]) {
  return {
    allOf: [
      { $ref: getSchemaPath(PaginatedResponseDto) },
      {
        properties: {
          data: {
            type: 'array',
            items: { $ref: getSchemaPath(dto) },
          },
        },
      },
    ],
  };
}
```

#### Usage Example

`GetTodoItemsItem` is a concrete DTO type wrapped by `PaginatedResponseDto`

```ts
// controller

@Get()
@ApiOkResponse({ schema: getPaginatedSchema(GetTodoItemsItem) })
@ApiQuery({ type: PaginationDto, required: false })
getTodoItems(
  @PaginationQuery()
  pagination?: PaginationDto,
): PaginatedResponseDto<GetTodoItemsItem> {
  ...
}
```

## API Response

Error response structure:

```ts
export class ErrorApiResponse {
  @ApiProperty({
    description: 'SCREAMING_CASE error code that identifies the problem type',
  })
  code: string;
  @ApiProperty({
    description:
      'Short, human-readable summary of the problem. Should not change from occurrence to occurrence',
  })
  title?: string;
  @ApiProperty({
    description:
      'Extension that contains a list of individual errors. One of the possible applications is validation error',
  })
  errors?: ResponseError[];
}

export class ResponseError {
  @ApiProperty({ description: 'Field name' })
  field: string;
  @ApiProperty({
    description:
      'Human-readable explanation specific to this occurrence of the problem',
  })
  detail: string;
}
```

There are 2 cases when `ErrorApiResponse` can be used

- in exception filter when exception is caught and we need to map it to HTTP response
- in controller if underlying code returns some kind of Result that can be successful or failed instead of throwing exceptions

Create `DefaultExceptionFilter` class to return `ErrorApiResponse`. By default it returns `INTERNAL_SERVER_ERROR`

Use error codes for errors. Those are reusable across entire application

```ts
// error-code.ts

export enum ErrorCode {
  INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
}
```

```ts
@Catch()
export class DefaultExceptionFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    // In certain situations `httpAdapter` might not be available in the
    // constructor method, thus we should resolve it here.
    const { httpAdapter } = this.httpAdapterHost;

    const ctx = host.switchToHttp();

    let httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
    let responseBody: ErrorApiResponse = {
      code: HttpStatus[HttpStatus.INTERNAL_SERVER_ERROR],
      title: 'Something unexpected happened',
    };

    switch (true) {
      // case exception instanceof SpecificException:
      //   responseBody = { ... };
      //   httpStatus = ...;
    }

    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }
```

## NestJS Validation and Transformation with `class-validator` and `class-transformer`

To return `ErrorApiResponse` format in case of validation failure, we need to

- create custom `ValidationException` and store validation errors

```ts
export class ValidationException extends Error {
  errors: Array<{
    field: string;
    message: string;
  }> = [];
}
```

- create `validationPipeExceptionFactory` function to throw custom `ValidationException` with all necessary information

```ts
import { ValidationError } from '@nestjs/common';
import { ValidationException } from './validation.exception';

export function validationPipeExceptionFactory(
  errors: ValidationError[],
): ValidationException {
  const ex = new ValidationException();
  ex.errors = errors.flatMap((e) => {
    if (!e.constraints) {
      return [];
    }

    return Object.values(e.constraints).map((message) => ({
      field: e.property,
      message,
    }));
  });

  return ex;
}
```

- extend `DefaultExceptionFilter` to handle `ValidationException`

```ts
@Catch()
export class DefaultExceptionFilter implements ExceptionFilter {
  // ..

  catch(exception: unknown, host: ArgumentsHost): void {
    // ...
    switch (true) {
      case exception instanceof ValidationException:
        responseBody = this.fromValidationException(exception);
        httpStatus = HttpStatus.BAD_REQUEST;
    }
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
}
```

Use global validation

```ts
// main.ts
app.useGlobalPipes(
  new ValidationPipe({
    whitelist: true, // strip unknown properties
    forbidUnknownValues: false,
    transform: true, // transform raw objects into DTOs
    stopAtFirstError: false, // validate full payload
    exceptionFactory: validationPipeExceptionFactory,
  }),
);
```

Also, custom decorators are not validated by default

- use `ValidationPipe`
- use `transform: true` to create instance of DTO
- use `validateCustomDecorators: true` to apply validation
- use `exceptionFactory: validationPipeExceptionFactory` to throw `ValidationException`

```ts
@CustomDecorator(
  new ValidationPipe({
    transform: true,
    validateCustomDecorators: true,
    exceptionFactory: validationPipeExceptionFactory,
  })
) dto: CustomDto,
```

Consider baking ValidationPipe parameters into decorator to avoid passing params every time custom decorator is used
