import { INestApplication } from '@nestjs/common';
import helmet from 'helmet';
import { setupSwagger } from './swagger/setup-swagger';
import { useGlobalPipes } from './validation/use-global-pipes';

export function configureApp(app: INestApplication) {
  // Note that applying helmet as global or registering it must come before other calls to app.use() or setup functions that may call app.use().
  // This is due to the way the underlying platform (i.e., Express or Fastify) works, where the order that middleware/routes are defined matters.
  // If you use middleware like helmet or cors after you define a route, then that middleware will not apply to that route, it will only apply to routes defined after the middleware.
  app.use(helmet());

  useGlobalPipes(app);
  setupSwagger(app);
}
