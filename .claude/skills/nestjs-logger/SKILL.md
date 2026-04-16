---
name: nestjs-logger
description: Logging patterns using the AppLogger contract over Pino, accessed via NestJS's built-in Logger facade. Use when writing `this.logger.log/debug/warn/error/fatal`, calling `new Logger(...)`, shaping a structured log entry, or reviewing log call sites and levels. Do NOT use for configuring Pino transports, LoggerModule wiring, or `main.ts` bootstrap — that's infrastructure, not call-site guidance.
---

# NestJS Logger

## When to use this skill

- Adding log statements to any class (controller, service, filter, interceptor, guard)
- Reviewing or refactoring log call sites
- Choosing a log level or shaping a structured log entry
- Logging caught errors

## How it works

Every `Logger` from `@nestjs/common` routes through `AppLogger` (`src/platform/logger/app.logger.ts`), which writes to Pino and auto-enriches entries with `reqId` and `traceId` from request context. Never set those fields manually.

## Create a logger instance per class

```typescript
import { Logger } from '@nestjs/common';

export class TodoService {
  private readonly logger = new Logger(TodoService.name);
}
```

- Import `Logger` from `@nestjs/common` — never from `pino` or `app.logger.ts`
- Pass `ClassName.name` — becomes the `context` field on every entry
- Declare as `private readonly logger`
- Do **not** inject `AppLogger` in feature code — it is exported only for `main.ts` bootstrap wiring

## Log Contract

The `LogEntry` type from `app.logger.ts`:

```typescript
type LogEntry = Record<string, unknown> & {
  msg?: string;
  err?: Error;
  context?: string;
};
```

Each level method accepts one of three input shapes, optionally followed by a `context` override:

| Input             | Behavior                                                 |
| ----------------- | -------------------------------------------------------- |
| `string`          | Becomes `entry.msg`                                      |
| `Error`           | Becomes `entry.err`; `error.message` becomes `entry.msg` |
| `LogEntry` object | Spread onto the entry as-is; arbitrary fields preserved  |

### Field conventions

- `msg` — short human-readable summary; starts with a capital letter, no trailing punctuation
- `err` — the `Error` instance; do not stringify or pre-format it
- Custom fields — top-level on the entry object, not nested under `metadata`/`data`
- `context` — set automatically from `new Logger(ClassName.name)`; can be overridden by passing as the second arg or via `entry.context` when needed
- `reqId`, `traceId` — auto-enriched from request context; do not set manually

Prefer the **object form** for any log that carries data — it produces structured, queryable output. Use the string form only for message-only entries.

### Prefer structured fields over string interpolation

```typescript
// Don't — data is trapped in an unqueryable string
this.logger.log(`User ${userId} completed todo ${todoId} in ${ms}ms`);

// Don't — error context is lost
this.logger.error(`Failed to save todo: ${err.message}`);

// Do — fields are indexed and queryable
this.logger.log({ msg: 'Todo completed', userId, todoId, durationMs: ms });

// Do — err preserves the stack trace
this.logger.error({ msg: 'Failed to save todo', err, todoId });
```

### Call shapes

All three shapes work identically across `log`, `debug`, `warn`, `error`, and `fatal`:

```typescript
// string — message-only entry
this.logger.log('Cache warmed');

// Error — err field set, msg taken from error.message
this.logger.error(new Error('connection refused'));

// LogEntry — preferred form whenever there is data to attach
this.logger.error({ msg: 'Failed to start dice service', err, diceId });
```

Any shape accepts an optional second `context` string argument to override the class-name context — rarely needed in feature code.

> **Note:** `error(msg, stack)` is implemented only for NestJS internal calls — do not use it in feature code.

## Log levels

| Method         | Pino level | Use for                                                              |
| -------------- | ---------- | -------------------------------------------------------------------- |
| `logger.debug` | `debug`    | Verbose diagnostic detail useful only when debugging                 |
| `logger.log`   | `info`     | Normal operational events (request handled, job completed)           |
| `logger.warn`  | `warn`     | Recoverable problems or unexpected-but-handled conditions            |
| `logger.error` | `error`    | Failures that need attention; always include `err`                   |
| `logger.fatal` | `fatal`    | Process-terminating failures; rare, typically only in bootstrap code |

`logger.log` is Nest's name for `info` — there is no separate `info` method.

## Key rules

- Never inject `AppLogger`, import from `pino`, or call `console.log` in feature code
- Never set `reqId` or `traceId` manually — auto-enriched from request context
- Pass `Error` via the `err` field, not interpolated into `msg` — preserves the stack
- Prefer `{ msg, ...fields }` over template literals whenever there is data to attach
