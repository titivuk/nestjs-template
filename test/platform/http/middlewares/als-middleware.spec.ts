import { Controller, Get, HttpStatus, INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { Als } from '../../../../src/platform/als/als';
import { AlsModule } from '../../../../src/platform/als/als.module';
import { configureApp } from '../../../../src/platform/http/configure-app';
import { HttpModule } from '../../../../src/platform/http/http.module';

@Controller()
class TestController {
  constructor(private readonly als: Als) {}

  @Get('als')
  unknownError() {
    return this.als.contextInitialized();
  }
}

describe('AlsMiddleware', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [HttpModule, AlsModule],
      controllers: [TestController],
    }).compile();

    app = moduleRef.createNestApplication();
    configureApp(app);

    await app.init();
  });

  it('should return store', async () => {
    await request(app.getHttpServer())
      .get('/als')
      .expect(HttpStatus.OK)
      .expect('true');
  });

  afterAll(async () => {
    await app.close();
  });
});
