import { Injectable } from '@nestjs/common';
import { Als } from '@platform/als/als';
import { RequestContext } from './request-context';

@Injectable()
export class RequestContextService {
  constructor(private readonly als: Als) {}

  getContext(): RequestContext | undefined {
    return this.als.get<RequestContext>('request-context');
  }

  getContextOrFail(): RequestContext {
    const ctx = this.getContext();
    if (!ctx) {
      throw new Error('Missing request context');
    }

    return ctx;
  }
}
