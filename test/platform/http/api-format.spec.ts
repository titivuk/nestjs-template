import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  INestApplication,
  Post,
} from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { IsString } from 'class-validator';
import request from 'supertest';
import { configureApp } from '../../../src/platform/http/configure-app';
import { ErrorApiResponse } from '../../../src/platform/http/error-api-response.dto';
import { ErrorCode } from '../../../src/platform/http/error-code';
import { HttpModule } from '../../../src/platform/http/http.module';

class TestDto {
  @IsString()
  foo!: string;
}

@Controller()
class TestController {
  @HttpCode(HttpStatus.OK)
  @Post('with-body')
  withBody(@Body() body: TestDto) {
    return body;
  }

  @Get('unknown-error')
  unknownError() {
    throw new Error('Unknown error');
  }
}

describe('API format', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [HttpModule],
      controllers: [TestController],
    }).compile();

    app = moduleRef.createNestApplication();
    configureApp(app);

    await app.init();
  });

  it('should return OK response', async () => {
    const body = { foo: 'bar' };

    await request(app.getHttpServer())
      .post('/with-body')
      .send(body)
      .expect(HttpStatus.OK)
      .expect(body);
  });

  it('should return validation error when validation fails', async () => {
    await request(app.getHttpServer())
      .post('/with-body')
      .send({})
      .expect(HttpStatus.BAD_REQUEST)
      .expect({
        code: ErrorCode.VALIDATION_ERROR,
        title: 'Validation failed',
        errors: [
          {
            field: 'foo',
            detail: 'foo must be a string',
          },
        ],
      } satisfies ErrorApiResponse);
  });

  it('should return internal server error when unknown error is thrown', async () => {
    await request(app.getHttpServer())
      .get('/unknown-error')
      .expect(HttpStatus.INTERNAL_SERVER_ERROR)
      .expect({
        code: ErrorCode.INTERNAL_SERVER_ERROR,
        title: 'Something unexpected happened',
      } satisfies ErrorApiResponse);
  });

  it('should return 404 when endpoint does not exist', async () => {
    await request(app.getHttpServer())
      .get('/ahlfhasdlfkahfueiufahleskf')
      .expect(HttpStatus.NOT_FOUND)
      .expect({
        code: ErrorCode.NOT_FOUND,
        title: 'Cannot GET /ahlfhasdlfkahfueiufahleskf',
      } satisfies ErrorApiResponse);
  });

  afterAll(async () => {
    await app.close();
  });
});
