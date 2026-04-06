---
name: nestjs-config
description: NestJS configuration patterns using ConfigModule with registerAs namespaces. Use when creating, modifying, or reviewing module configuration, environment variables, or AppConfigModule setup.
---

# NestJS Configuration

## When to use this skill

- Adding configuration to a new or existing module
- Creating environment variable bindings
- Reviewing or refactoring config patterns
- Setting up shared/application-level configuration

## Architecture

- `AppConfigModule` (`src/platform/config/`) wraps `ConfigModule.forRoot()` with `isGlobal: true` and `ignoreEnvFile: true`. It is imported once in `AppModule`
- Every module defines its own config file — modules do not share configs
- For application-level config (if needed), create a shared config in `src/platform/config/` or near `app.module.ts`

## Creating module config

Each module config lives in a `<module-name>.config.ts` file next to the module. The type and config object are declared first so they can be used outside of DI (e.g. in instrumentation, bootstrap), then registered for DI.

```typescript
// src/platform/db/db.config.ts
import { registerAs } from '@nestjs/config';

// 1. Declare the type
export type DbConfig = {
  dbUrl: string;
};

// 2. Create the config object (usable outside DI)
export const dbConfig: DbConfig = {
  dbUrl: process.env.DB_URL!,
};

// 3. Register for DI
export const dbConfigNamespace = registerAs('db', () => dbConfig);
```

### Conventions

- Declare the type explicitly first (`export type DbConfig = { ... }`)
- Create a plain config object (`export const dbConfig: DbConfig = { ... }`) — this is the source of truth, usable anywhere
- Register for DI last (`export const dbConfigNamespace = registerAs(...)`) — the factory returns the already-created config object
- Name the namespace export `<module>ConfigNamespace` (e.g. `dbConfigNamespace`)
- Use `registerAs('<module-name>', () => ...)` — namespace matches module name
- Read from `process.env` in the config object — no `.env` files (they are ignored)
- Use `!` assertion for required env vars

## Registering config in a module

Import `ConfigModule.forFeature()` in the module that owns the config:

```typescript
import { ConfigModule } from '@nestjs/config';
import { dbConfigNamespace } from './db.config';

@Module({
  imports: [ConfigModule.forFeature(dbConfigNamespace)],
  // ...
})
export class DbModule {}
```

## Injecting config

Use `namespace.KEY` token for injection in providers/factories:

```typescript
import { DbConfig, dbConfigNamespace } from './db.config';

@Module({
  providers: [
    {
      provide: SOME_KEY,
      inject: [dbConfigNamespace.KEY],
      useFactory: (dbConfig: DbConfig) => {
        // use dbConfig.dbUrl, dbConfig.maxPoolSize, etc.
      },
    },
  ],
})
```

In services, inject via constructor:

```typescript
import { Inject, Injectable } from '@nestjs/common';
import { DbConfig, dbConfigNamespace } from './db.config';

@Injectable()
export class SomeService {
  constructor(
    @Inject(dbConfigNamespace.KEY)
    private readonly dbConfig: DbConfig,
  ) {}
}
```
