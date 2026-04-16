import {
  ArgumentsHost,
  BadRequestException,
  HttpStatus,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { ErrorCode } from '@src/platform/http/error-code';
import { HttpExceptionFilter } from '@src/platform/http/http.exception-filter';
import { ValidationException } from '@src/platform/http/validation/validation.exception';
import { Mocked } from '@suites/doubles.jest';
import { TestBed } from '@suites/unit';

describe('HttpExceptionFilter', () => {
  let filter: HttpExceptionFilter;
  let httpAdapterHost: Mocked<HttpAdapterHost>;
  let response: object;
  let host: ArgumentsHost;
  let loggerErrorSpy: jest.SpyInstance;

  beforeEach(async () => {
    const { unit, unitRef } =
      await TestBed.solitary(HttpExceptionFilter).compile();

    filter = unit;
    httpAdapterHost = unitRef.get(HttpAdapterHost);

    response = {};
    host = {
      switchToHttp: () => ({
        getResponse: () => response,
        getRequest: () => ({}),
        getNext: () => ({}),
      }),
    } as unknown as ArgumentsHost;

    loggerErrorSpy = jest
      .spyOn(Logger.prototype, 'error')
      .mockImplementation(() => undefined);
  });

  afterEach(() => {
    loggerErrorSpy.mockRestore();
  });

  it('maps ValidationException to Bad Request response', () => {
    const exception = new ValidationException();
    exception.errors = [
      { field: 'email', message: 'must be an email' },
      { field: 'age', message: 'must be a number' },
    ];

    filter.catch(exception, host);

    expect(httpAdapterHost.httpAdapter.reply).toHaveBeenCalledWith(
      response,
      {
        code: ErrorCode.VALIDATION_ERROR,
        title: 'Validation failed',
        errors: [
          { field: 'email', detail: 'must be an email' },
          { field: 'age', detail: 'must be a number' },
        ],
      },
      HttpStatus.BAD_REQUEST,
    );
  });

  it('maps NotFoundException to Not Found response', () => {
    const exception = new NotFoundException('Todo not found');

    filter.catch(exception, host);

    expect(httpAdapterHost.httpAdapter.reply).toHaveBeenCalledWith(
      response,
      { code: ErrorCode.NOT_FOUND, title: 'Todo not found' },
      HttpStatus.NOT_FOUND,
    );
  });

  it('maps unknown exception to Internal Server Error', () => {
    filter.catch(new Error('boom'), host);

    expect(httpAdapterHost.httpAdapter.reply).toHaveBeenCalledWith(
      response,
      {
        code: ErrorCode.INTERNAL_SERVER_ERROR,
        title: 'Something unexpected happened',
      },
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  });

  it('does not log ValidationException', () => {
    const exception = new ValidationException();
    exception.errors = [];

    filter.catch(exception, host);

    expect(loggerErrorSpy).not.toHaveBeenCalled();
  });

  it('does not log HttpException with status < 500', () => {
    filter.catch(new BadRequestException('bad input'), host);

    expect(loggerErrorSpy).not.toHaveBeenCalled();
  });

  it('logs HttpException with status >= 500', () => {
    const exception = new InternalServerErrorException('db down');

    filter.catch(exception, host);

    expect(loggerErrorSpy).toHaveBeenCalledWith({
      msg: 'Unhandled exception',
      err: exception,
    });
  });

  it('logs unknown (non-HttpException) exceptions', () => {
    const exception = new Error('boom');

    filter.catch(exception, host);

    expect(loggerErrorSpy).toHaveBeenCalledWith({
      msg: 'Unhandled exception',
      err: exception,
    });
  });
});
