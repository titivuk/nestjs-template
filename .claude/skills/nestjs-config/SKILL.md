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

Each module config lives in a `<module-name>.config.ts` file next to the module.

```typescript
// src/platform/db/db.config.ts
import { ConfigType, registerAs } from '@nestjs/config';

export const dbConfigNamespace = registerAs('db', () => ({
  dbUrl: process.env.DB_URL!,
}));

export type DbConfig = ConfigType<typeof dbConfigNamespace>;
```

### Conventions

- Name the namespace export `<module>ConfigNamespace` (e.g. `dbConfigNamespace`)
- Use `registerAs('<module-name>', () => (...))` — namespace matches module name
- Export a type alias: `type DbConfig = ConfigType<typeof dbConfigNamespace>`
- Read from `process.env` inside the factory — no `.env` files (they are ignored)
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
