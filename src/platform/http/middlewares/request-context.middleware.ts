import { Injectable, NestMiddleware } from '@nestjs/common';
import type express from 'express';
import { randomUUID } from 'node:crypto';
import { Als } from '../../als/als';
import { RequestContext } from '../../request-context/request-context';

@Injectable()
export class RequestContextMiddleware implements NestMiddleware {
  constructor(private readonly als: Als) {}

  use(req: express.Request, res: any, next: (error?: any) => void) {
    const requestContext: RequestContext = {
      requestId:
        this.getStringValueFromHeaders(req, 'x-request-id') || randomUUID(),
      traceId:
        this.getStringValueFromHeaders(req, 'x-trace-id') || randomUUID(),
    };

    this.als.append('request-context', requestContext);

    return next();
  }

  private getStringValueFromHeaders(
    req: express.Request,
    key: string,
  ): string | undefined {
    const val = req.headers[key];
    if (!val) {
      return;
    }

    if (Array.isArray(val)) {
      return val[0];
    }

    return val;
  }
}
