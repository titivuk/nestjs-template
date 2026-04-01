import { Inject, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { DbConfig, dbConfigNamespace } from './db.config';

const DB_PROVIDER_KEY = Symbol.for('DB_PROVIDER');
export type DbProvider = ReturnType<typeof drizzle>;
export const InjectDb = () => Inject(DB_PROVIDER_KEY);

@Module({
  imports: [ConfigModule.forFeature(dbConfigNamespace)],
  providers: [
    {
      provide: DB_PROVIDER_KEY,
      inject: [dbConfigNamespace.KEY],
      useFactory: (dbConfig: DbConfig) => {
        const pool = new Pool({
          connectionString: dbConfig.dbUrl,
          min: dbConfig.minPoolSize,
          max: dbConfig.maxPoolSize,
          idleTimeoutMillis: dbConfig.idleTimeoutMs,
          connectionTimeoutMillis: dbConfig.connectionTimeoutMs,
        });

        return drizzle({
          client: pool,
          casing: 'snake_case',
        });
      },
    },
  ],
  exports: [DB_PROVIDER_KEY],
})
export class DbModule {}
