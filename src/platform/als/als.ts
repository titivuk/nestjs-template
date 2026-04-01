import { AsyncLocalStorage } from 'node:async_hooks';

type AlsStore = Record<string, any>;

export class Als {
  constructor(private readonly als: AsyncLocalStorage<AlsStore>) {}

  run<R>(callback: () => R): R;
  run<R, TArgs extends any[]>(
    callback: (...args: TArgs) => R,
    ...args: TArgs
  ): R {
    return this.als.run({}, callback, ...args);
  }

  append(key: string, value: unknown) {
    const store = this.als.getStore();
    if (!store) {
      throw new Error('AsyncLocalStorage is not initialized');
    }

    store[key] = value;
  }

  get<T = unknown>(key: string): T | undefined {
    return this.als.getStore()?.[key] as T;
  }

  contextInitialized(): boolean {
    return this.als.getStore() !== undefined;
  }
}
