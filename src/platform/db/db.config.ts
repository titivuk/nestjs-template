import { ConfigType, registerAs } from '@nestjs/config';

export const dbConfigNamespace = registerAs('db', () => ({
  dbUrl: process.env.DB_URL!,
  minPoolSize: numberOrDefault(process.env.DB_MIN_POOL_SIZE, 5),
  maxPoolSize: numberOrDefault(process.env.DB_MAX_POOL_SIZE, 20),
  idleTimeoutMs: numberOrDefault(process.env.DB_IDLE_TIMEOUT_MS, 30_000),
  connectionTimeoutMs: numberOrDefault(
    process.env.DB_CONNECTION_TIMEOUT_MS,
    2_000,
  ),
}));

export type DbConfig = ConfigType<typeof dbConfigNamespace>;

function numberOrDefault(val: unknown, defaultValue: number): number {
  if (typeof val !== 'string') {
    return defaultValue;
  }

  return Number.parseInt(val, 10);
}
