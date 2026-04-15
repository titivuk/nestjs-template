export type TestCase = { name: string; input: [any, ...any[]]; expected: any };

export function createTestCases(): TestCase[] {
  const err = new Error('test message');

  const testCases: TestCase[] = [
    // (msg: string, ...)
    {
      name: 'should log single message',
      input: ['log message'],
      expected: { msg: 'log message' },
    },
    {
      name: 'should log message with context',
      input: ['log message', 'TestFile'],
      expected: { msg: 'log message', context: 'TestFile' },
    },
    // (err: Error, ...)
    {
      name: 'should log single error',
      input: [err],
      expected: { msg: err.message, err },
    },
    {
      name: 'should log error and context',
      input: [err, 'TestFile'],
      expected: { msg: err.message, err, context: 'TestFile' },
    },
    // (logEntry: LogEntry)
    {
      name: 'should log entry with msg',
      input: [{ msg: 'log message' }],
      expected: {
        msg: 'log message',
      },
    },
    {
      name: 'should log entry with context',
      input: [{ context: 'TestFile' }],
      expected: {
        context: 'TestFile',
      },
    },
    {
      name: 'should log entry with error',
      input: [{ err }],
      expected: {
        err,
      },
    },
    {
      name: 'should log entry additional data',
      input: [{ foo: 'bar' }],
      expected: {
        foo: 'bar',
      },
    },
    {
      name: 'should log full entry',
      input: [{ msg: 'log message', err, context: 'TestFile', foo: 'bar' }],
      expected: {
        msg: 'log message',
        err,
        context: 'TestFile',
        foo: 'bar',
      },
    },
  ];

  return testCases;
}

export function createErrorSpecialTestCases(): TestCase[] {
  const err = new Error('test message');

  const errorSpecialTestCases: TestCase[] = [
    {
      name: 'should log single message',
      input: ['log message'],
      expected: {
        msg: 'log message',
      },
    },
    {
      name: 'should log message with stack',
      input: ['log message', err.stack],
      expected: {
        msg: 'log message',
        err: (() => {
          const e = new Error('log message');
          e.stack = err.stack;
          return e;
        })(),
      },
    },
    {
      name: 'should log message with context',
      input: ['log message', 'TestFile'],
      expected: {
        msg: 'log message',
        context: 'TestFile',
      },
    },
    {
      name: 'should log message with stack and context',
      input: ['log message', err.stack, 'TestFile'],
      expected: {
        msg: 'log message',
        err: (() => {
          const e = new Error('log message');
          e.stack = err.stack;
          return e;
        })(),
        context: 'TestFile',
      },
    },
  ];

  return errorSpecialTestCases;
}
