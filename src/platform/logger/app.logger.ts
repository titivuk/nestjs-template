import { Inject, Injectable, LoggerService, LogLevel } from '@nestjs/common';
import pino from 'pino';
import { PINO_LOGGER_KEY } from './pino';
import { RequestContextService } from '../request-context/request-context.service';

export type LogEntry = Record<string, unknown> & {
  msg?: string;
  err?: Error;
  context?: string;
};

@Injectable()
export class AppLogger implements LoggerService {
  constructor(
    @Inject(PINO_LOGGER_KEY) private readonly pinoLogger: pino.Logger,
    private readonly requestContext: RequestContextService,
  ) {}

  log(msg: string, context?: string): void;
  log(err: Error, context?: string): void;
  log(logEntry: LogEntry, context?: string): void;
  log(input: string | Error | LogEntry, context?: string) {
    const entry = this.parseInput(input, context);
    this.write(entry, 'info');
  }

  debug(msg: string, context?: string): void;
  debug(err: Error, context?: string): void;
  debug(logEntry: LogEntry, context?: string): void;
  debug(input: string | Error | LogEntry, context?: string) {
    const entry = this.parseInput(input, context);
    this.write(entry, 'debug');
  }

  warn(msg: string, context?: string): void;
  warn(err: Error, context?: string): void;
  warn(logEntry: LogEntry, context?: string): void;
  warn(input: string | Error | LogEntry, context?: string) {
    const entry = this.parseInput(input, context);
    this.write(entry, 'warn');
  }

  /**
   * special case for nestjs internal calls
   * @see https://docs.nestjs.com/techniques/logger#extend-built-in-logger
   */
  error(msg: any, stack?: string, context?: string): void;
  error(msg: string, context?: string): void;
  error(err: Error, context?: string): void;
  error(logEntry: LogEntry, context?: string): void;
  error(
    input: string | Error | LogEntry,
    stackOrContext?: string,
    context?: string,
  ) {
    let entry: LogEntry;

    // nestjs special case
    if (
      typeof stackOrContext === 'string' &&
      this.isStackFormat(stackOrContext)
    ) {
      entry = this.parseInput(input, context);

      if (typeof input === 'string') {
        entry.err = new Error(input);
        entry.err.stack = stackOrContext;
      }
    } else {
      entry = this.parseInput(input, stackOrContext);
    }

    this.write(entry, 'error');
  }

  fatal(msg: string, context?: string): void;
  fatal(err: Error, context?: string): void;
  fatal(logEntry: LogEntry, context?: string): void;
  fatal(input: string | Error | LogEntry, context?: string) {
    const entry = this.parseInput(input, context);
    this.write(entry, 'fatal');
  }

  setLogLevels(levels: LogLevel[]) {
    throw new Error('Method not implemented');
  }

  private parseInput(
    input: string | Error | LogEntry,
    context?: string,
  ): LogEntry {
    const entry: LogEntry = {};

    if (typeof context === 'string') {
      entry.context = context;
    }

    if (typeof input === 'string') {
      entry.msg = input;
    } else if (input instanceof Error) {
      entry.err = input;
      entry.msg = input.message;
    } else if (this.isObject(input)) {
      Object.assign(entry, input);
    }

    return entry;
  }

  private write(entry: LogEntry, level: pino.Level) {
    if (!this.pinoLogger.isLevelEnabled(level)) {
      return;
    }

    this.enrichLog(entry);
    this.pinoLogger[level](entry);
  }

  private enrichLog(entry: LogEntry) {
    const ctx = this.requestContext.getContext();

    if (ctx) {
      entry.reqId = ctx.requestId;
      entry.traceId = ctx.traceId;
    }
  }

  private isObject(val: unknown): val is object {
    return val !== null && typeof val === 'object';
  }

  /**
   * from https://github.com/nestjs/nest/blob/master/packages/common/services/console-logger.service.ts#L597
   */
  private isStackFormat(stack: unknown) {
    if (typeof stack !== 'string') {
      return false;
    }

    return /^(.)+\n\s+at .+:\d+:\d+/.test(stack);
  }
}
