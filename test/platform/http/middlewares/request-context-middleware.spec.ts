import { Controller, Get, HttpStatus, INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { configureApp } from '../../../../src/platform/http/configure-app';
import { HttpModule } from '../../../../src/platform/http/http.module';
import type { RequestContext } from '../../../../src/platform/request-context/request-context';
import { RequestContextModule } from '../../../../src/platform/request-context/request-context.module';
import { RequestContextService } from '../../../../src/platform/request-context/request-context.service';

@Controller()
class TestController {
  constructor(private readonly requestContextService: RequestContextService) {}

  @Get('request-context')
  unknownError(): RequestContext {
    return this.requestContextService.getContextOrFail();
  }
}

describe('RequestContextMiddleware', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [HttpModule, RequestContextModule],
      controllers: [TestController],
    }).compile();

    app = moduleRef.createNestApplication();
    configureApp(app);

    await app.init();
  });

  it('should return request context', async () => {
    const expectedRequestContext: RequestContext = {
      requestId: expect.any(String) as string,
      traceId: expect.any(String) as string,
    };

    const response = await request(app.getHttpServer()).get('/request-context');

    expect(response.statusCode).toBe(HttpStatus.OK);
    expect(response.body).toMatchObject(expectedRequestContext);
  });

  afterAll(async () => {
    await app.close();
  });
});
