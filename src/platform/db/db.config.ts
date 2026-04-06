import { registerAs } from '@nestjs/config';

export type DbConfig = {
  dbUrl: string;
  minPoolSize: number;
  maxPoolSize: number;
  idleTimeoutMs: number;
  connectionTimeoutMs: number;
};

export const dbConfig: DbConfig = {
  dbUrl: process.env.DB_URL!,
  minPoolSize: numberOrDefault(process.env.DB_MIN_POOL_SIZE, 5),
  maxPoolSize: numberOrDefault(process.env.DB_MAX_POOL_SIZE, 20),
  idleTimeoutMs: numberOrDefault(process.env.DB_IDLE_TIMEOUT_MS, 30_000),
  connectionTimeoutMs: numberOrDefault(
    process.env.DB_CONNECTION_TIMEOUT_MS,
    2_000,
  ),
};

export const dbConfigNamespace = registerAs('db', () => dbConfig);

function numberOrDefault(val: unknown, defaultValue: number): number {
  if (typeof val !== 'string') {
    return defaultValue;
  }

  return Number.parseInt(val, 10);
}
