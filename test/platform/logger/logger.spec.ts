import { INestApplication, Logger } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppLogger } from '@src/platform/logger/app.logger';
import { LoggerModule } from '@src/platform/logger/logger.module';
import { PINO_LOGGER_KEY } from '@src/platform/logger/pino';
import { mock, type Mocked } from '@suites/doubles.jest';
import pino from 'pino';
import {
  type TestCase,
  createTestCases,
  createErrorSpecialTestCases,
} from './test-cases';

/**
 * Test integration of AppLogger and Nestjs Logger
 */
describe('AppLogger integration with nestjs Logger', () => {
  let app: INestApplication;
  let pinoLogger: Mocked<pino.Logger>;

  const testCases = createTestCases();
  const errorSpecialTestCases = createErrorSpecialTestCases();

  beforeAll(async () => {
    pinoLogger = mock();

    const moduleRef = await Test.createTestingModule({
      imports: [LoggerModule],
    })
      .overrideProvider(PINO_LOGGER_KEY)
      .useValue(pinoLogger)
      .compile();

    app = moduleRef.createNestApplication();
    app.useLogger(app.get(AppLogger));

    await app.init();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it.each(testCases)('[debug]: $name', ({ input, expected }: TestCase) => {
    const logger = new Logger();
    pinoLogger.isLevelEnabled.mockReturnValue(true);

    logger.debug(...input);

    expect(pinoLogger.debug).toHaveBeenCalledWith(expected);
  });

  it.each(testCases)('[log]: $name', ({ input, expected }: TestCase) => {
    const logger = new Logger();
    pinoLogger.isLevelEnabled.mockReturnValue(true);

    logger.log(...input);

    expect(pinoLogger.info).toHaveBeenCalledWith(expected);
  });

  it.each(testCases)('[warn]: $name', ({ input, expected }: TestCase) => {
    const logger = new Logger();
    pinoLogger.isLevelEnabled.mockReturnValue(true);

    logger.warn(...input);

    expect(pinoLogger.warn).toHaveBeenCalledWith(expected);
  });

  it.each(testCases)('[error]: $name', ({ input, expected }: TestCase) => {
    const logger = new Logger();
    pinoLogger.isLevelEnabled.mockReturnValue(true);

    logger.error(...input);

    expect(pinoLogger.error).toHaveBeenCalledWith(expected);
  });

  it.each(testCases)('[fatal]: $name', ({ input, expected }: TestCase) => {
    const logger = new Logger();
    pinoLogger.isLevelEnabled.mockReturnValue(true);

    logger.fatal(...input);

    expect(pinoLogger.fatal).toHaveBeenCalledWith(expected);
  });

  it.each(errorSpecialTestCases)(
    '[error]: special nestjs case - $name',
    ({ input, expected }: TestCase) => {
      const logger = new Logger();
      pinoLogger.isLevelEnabled.mockReturnValue(true);

      logger.error(...input);

      expect(pinoLogger.error).toHaveBeenCalledWith(expected);
    },
  );

  afterAll(async () => {
    await app.close();
  });
});
