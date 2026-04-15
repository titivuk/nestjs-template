import { AppLogger } from '@src/platform/logger/app.logger';
import { PINO_LOGGER_KEY } from '@src/platform/logger/pino';
import { TestBed, type Mocked } from '@suites/unit';
import pino from 'pino';
import {
  type TestCase,
  createTestCases,
  createErrorSpecialTestCases,
} from './test-cases';

describe('AppLogger', () => {
  let logger: AppLogger;
  let pinoLogger: Mocked<pino.Logger>;

  const testCases = createTestCases();
  const errorSpecialTestCases = createErrorSpecialTestCases();

  beforeAll(async () => {
    const { unit, unitRef } = await TestBed.solitary(AppLogger).compile();

    logger = unit;
    pinoLogger = unitRef.get(PINO_LOGGER_KEY);
  });

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it.each(testCases)('[debug]: $name', ({ input, expected }: TestCase) => {
    pinoLogger.isLevelEnabled.mockReturnValue(true);

    logger.debug(...input);

    expect(pinoLogger.debug).toHaveBeenCalledWith(expected);
  });

  it.each(testCases)('[log]: $name', ({ input, expected }: TestCase) => {
    pinoLogger.isLevelEnabled.mockReturnValue(true);

    logger.log(...input);

    expect(pinoLogger.info).toHaveBeenCalledWith(expected);
  });

  it.each(testCases)('[warn]: $name', ({ input, expected }: TestCase) => {
    pinoLogger.isLevelEnabled.mockReturnValue(true);

    logger.warn(...input);

    expect(pinoLogger.warn).toHaveBeenCalledWith(expected);
  });

  it.each(testCases)('[error]: $name', ({ input, expected }: TestCase) => {
    pinoLogger.isLevelEnabled.mockReturnValue(true);

    logger.error(...input);

    expect(pinoLogger.error).toHaveBeenCalledWith(expected);
  });

  it.each(testCases)('[fatal]: $name', ({ input, expected }: TestCase) => {
    pinoLogger.isLevelEnabled.mockReturnValue(true);

    logger.fatal(...input);

    expect(pinoLogger.fatal).toHaveBeenCalledWith(expected);
  });

  it.each(['debug', 'log', 'warn', 'error', 'fatal'] as const)(
    'should not call underlying logger',
    (lvl) => {
      pinoLogger.isLevelEnabled.mockReturnValue(false);
      logger[lvl]('test');

      expect(pinoLogger.trace).not.toHaveBeenCalled();
      expect(pinoLogger.debug).not.toHaveBeenCalled();
      expect(pinoLogger.info).not.toHaveBeenCalled();
      expect(pinoLogger.warn).not.toHaveBeenCalled();
      expect(pinoLogger.error).not.toHaveBeenCalled();
      expect(pinoLogger.fatal).not.toHaveBeenCalled();
    },
  );

  it.each(errorSpecialTestCases)(
    '[error]: special nestjs case - $name',
    ({ input, expected }: TestCase) => {
      pinoLogger.isLevelEnabled.mockReturnValue(true);

      logger.error(...input);

      expect(pinoLogger.error).toHaveBeenCalledWith(expected);
    },
  );
});
