import { registerAs } from '@nestjs/config';

export type AppConfig = {
  name: string;
  env: 'dev' | 'prod' | 'local';
};

export const appConfig: AppConfig = {
  name: process.env.APP_NAME!,
  env: process.env.ENV! as AppConfig['env'],
};

export const appConfigNamespace = registerAs('app', () => appConfig);
