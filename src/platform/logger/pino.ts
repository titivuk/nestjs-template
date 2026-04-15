import pino from 'pino';
import { appConfig } from '../config/app.config';

export const PINO_LOGGER_KEY = Symbol.for('PINO_LOGGER');
export const pinoLogger = pino({
  name: appConfig.name,
  // base
  // mixin: () => {
  //   return {
  //     todo: 'this might be useful to attach request ID or any other info instead of doing it in logger. However, we do not utilize DI, which is not a big deal, AsyncLocalStorage should be singleton anyway',
  //   };
  // },
});
