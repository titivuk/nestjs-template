import { Injectable, NestMiddleware } from '@nestjs/common';
import { Als } from '@platform/als/als';

@Injectable()
export class AlsMiddleware implements NestMiddleware {
  constructor(private readonly als: Als) {}

  use(req: any, res: any, next: (error?: any) => void) {
    this.als.run(() => next());
  }
}
