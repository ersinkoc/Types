import { describe, it, expect } from 'vitest';
import type { Plugin, Kernel, EventMap, EventHandler, TypedEventEmitter } from '../../src/plugin.js';
import type { Result } from '../../src/result.js';
import type { OxogError } from '../../src/errors.js';
import { Ok, Err } from '../../src/result.js';
import { OxogError as OxogErrorClass, ValidationError, PluginError } from '../../src/errors.js';
import { isPlugin, isKernel, isOk, isErr, isOxogError, isValidationError } from '../../src/guards.js';
import type { Branded } from '../../src/utils.js';

// Mock Kernel implementation for testing
class MockKernel implements Kernel {
  private plugins: Map<string, Plugin> = new Map();
  private eventHandlers: Map<string, Set<Function>> = new Map();
  private contextValue: unknown;

  constructor(context?: unknown) {
    this.contextValue = context ?? {};
  }

  use(plugin: Plugin): this {
    this.plugins.set(plugin.name, plugin);
    plugin.install(this);
    return this;
  }

  unregister(name: string): boolean {
    return this.plugins.delete(name);
  }

  getPlugin<T extends Plugin>(name: string): T | undefined {
    return this.plugins.get(name) as T | undefined;
  }

  listPlugins(): ReadonlyArray<Plugin> {
    return Array.from(this.plugins.values());
  }

  hasPlugin(name: string): boolean {
    return this.plugins.has(name);
  }

  emit(event: string, payload?: unknown): void {
    const handlers = this.eventHandlers.get(event);
    if (handlers) {
      handlers.forEach((handler) => {
        try {
          handler(payload);
        } catch (error) {
          console.error('Event handler error:', error);
        }
      });
    }
  }

  on(event: string, handler: (payload: unknown) => void): () => void {
    if (!this.eventHandlers.has(event)) {
      this.eventHandlers.set(event, new Set());
    }
    this.eventHandlers.get(event)!.add(handler);

    return () => {
      this.eventHandlers.get(event)?.delete(handler);
    };
  }

  getContext(): unknown {
    return this.contextValue;
  }
}

describe('Plugin and Kernel Integration', () => {
  it('should register and retrieve plugin', () => {
    const kernel = new MockKernel();

    const plugin: Plugin = {
      name: 'test-plugin',
      version: '1.0.0',
      install: () => {},
    };

    kernel.use(plugin);

    expect(kernel.hasPlugin('test-plugin')).toBe(true);
    expect(kernel.getPlugin('test-plugin')).toBe(plugin);
  });

  it('should emit and receive events', () => {
    const kernel = new MockKernel();
    let receivedPayload: unknown;

    kernel.on('test-event', (payload) => {
      receivedPayload = payload;
    });

    kernel.emit('test-event', { data: 'test' });

    expect(receivedPayload).toEqual({ data: 'test' });
  });

  it('should call plugin install method', () => {
    const kernel = new MockKernel();
    let installCalled = false;

    const plugin: Plugin = {
      name: 'test-plugin',
      version: '1.0.0',
      install: () => {
        installCalled = true;
      },
    };

    kernel.use(plugin);

    expect(installCalled).toBe(true);
  });

  it('should handle plugin dependencies', () => {
    const kernel = new MockKernel();

    const logger: Plugin = {
      name: 'logger',
      version: '1.0.0',
      install: () => {},
    };

    const app: Plugin = {
      name: 'app',
      version: '1.0.0',
      dependencies: ['logger'],
      install: (k) => {
        expect(k.hasPlugin('logger')).toBe(true);
      },
    };

    kernel.use(logger);
    kernel.use(app);

    expect(kernel.hasPlugin('logger')).toBe(true);
    expect(kernel.hasPlugin('app')).toBe(true);
  });

  it('should unregister plugin', () => {
    const kernel = new MockKernel();

    const plugin: Plugin = {
      name: 'test-plugin',
      version: '1.0.0',
      install: () => {},
    };

    kernel.use(plugin);
    expect(kernel.hasPlugin('test-plugin')).toBe(true);

    const removed = kernel.unregister('test-plugin');
    expect(removed).toBe(true);
    expect(kernel.hasPlugin('test-plugin')).toBe(false);
  });

  it('should list all plugins', () => {
    const kernel = new MockKernel();

    const plugin1: Plugin = {
      name: 'plugin-1',
      version: '1.0.0',
      install: () => {},
    };

    const plugin2: Plugin = {
      name: 'plugin-2',
      version: '1.0.0',
      install: () => {},
    };

    kernel.use(plugin1);
    kernel.use(plugin2);

    const plugins = kernel.listPlugins();
    expect(plugins).toHaveLength(2);
  });
});

describe('Result Type with Real-World Scenarios', () => {
  it('should handle API response', () => {
    function fetchUser(id: string): Result<{ name: string }, string> {
      if (id === 'valid') {
        return Ok({ name: 'John Doe' });
      }
      return Err('User not found');
    }

    const result = fetchUser('valid');
    if (isOk(result)) {
      expect(result.value.name).toBe('John Doe');
    }
  });

  it('should handle validation', () => {
    function validateEmail(email: string): Result<string, ValidationError> {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return Err(new ValidationError('Invalid email format', { email }));
      }
      return Ok(email);
    }

    const result = validateEmail('invalid-email');
    if (isErr(result)) {
      expect(isValidationError(result.error)).toBe(true);
    }
  });

  it('should chain operations', () => {
    function parseNumber(value: string): Result<number, string> {
      const num = Number(value);
      if (isNaN(num)) {
        return Err('Not a number');
      }
      return Ok(num);
    }

    function square(n: number): Result<number, string> {
      return Ok(n * n);
    }

    const result = parseNumber('5')
      .map((n) => n * 2)
      .map((n) => n + 1);

    if (isOk(result)) {
      expect(result.value).toBe(11);
    }
  });

  it('should handle errors in chain', () => {
    function parseNumber(value: string): Result<number, string> {
      const num = Number(value);
      if (isNaN(num)) {
        return Err('Not a number');
      }
      return Ok(num);
    }

    const result = parseNumber('invalid')
      .map((n) => n * 2)
      .mapErr((e) => `Failed: ${e}`);

    if (isErr(result)) {
      expect(result.error).toBe('Failed: Not a number');
    }
  });
});

describe('Error Handling Integration', () => {
  it('should throw and catch OxogError', () => {
    function riskyOperation(shouldFail: boolean): void {
      if (shouldFail) {
        throw new OxogErrorClass('Operation failed', 'OPERATION_FAILED');
      }
    }

    expect(() => riskyOperation(true)).toThrow(OxogErrorClass);
    expect(() => riskyOperation(false)).not.toThrow();
  });

  it('should handle validation errors', () => {
    function validateUser(user: { name: string; age: number }): void {
      if (!user.name) {
        throw new ValidationError('Name is required', { field: 'name' });
      }
      if (user.age < 0) {
        throw new ValidationError('Age must be positive', { field: 'age', value: user.age });
      }
    }

    expect(() => validateUser({ name: 'John', age: 30 })).not.toThrow();
    expect(() => validateUser({ name: '', age: 30 })).toThrow(ValidationError);
    expect(() => validateUser({ name: 'John', age: -1 })).toThrow(ValidationError);
  });

  it('should handle plugin errors', () => {
    function initializePlugin(pluginName: string, config: unknown): void {
      if (!config) {
        throw new PluginError('Missing configuration', pluginName, { config: null });
      }
    }

    expect(() => initializePlugin('cache-plugin', {})).not.toThrow();
    expect(() => initializePlugin('cache-plugin', null)).toThrow(PluginError);
  });
});

describe('Type Guards Integration', () => {
  it('should validate plugin structure', () => {
    const validPlugin = {
      name: 'test',
      version: '1.0.0',
      install: () => {},
    };

    const invalidPlugin = {
      name: 'test',
      version: '1.0.0',
      // missing install
    };

    expect(isPlugin(validPlugin)).toBe(true);
    expect(isPlugin(invalidPlugin)).toBe(false);
  });

  it('should validate kernel structure', () => {
    const validKernel = {
      use: () => {},
      unregister: () => true,
      getPlugin: () => undefined,
      listPlugins: () => [],
      hasPlugin: () => false,
      emit: () => {},
      on: () => () => {},
      getContext: () => {},
    };

    const invalidKernel = {
      use: () => {},
      // missing other methods
    };

    expect(isKernel(validKernel)).toBe(true);
    expect(isKernel(invalidKernel)).toBe(false);
  });

  it('should narrow error types', () => {
    function handleError(error: unknown): string {
      if (isValidationError(error)) {
        return `Validation: ${error.message}`;
      }
      if (isOxogError(error)) {
        return `Oxog: ${error.message}`;
      }
      return 'Unknown error';
    }

    expect(handleError(new ValidationError('Invalid'))).toBe('Validation: Invalid');
    expect(handleError(new OxogErrorClass('Error', 'ERROR'))).toBe('Oxog: Error');
    expect(handleError(new Error('Generic'))).toBe('Unknown error');
  });
});

describe('Branded Types Integration', () => {
  it('should create type-safe IDs', () => {
    type UserId = Branded<string, 'UserId'>;
    type OrderId = Branded<string, 'OrderId'>;

    const userId: UserId = 'user_123' as UserId;
    const orderId: OrderId = 'order_456' as OrderId;

    expect(typeof userId).toBe('string');
    expect(typeof orderId).toBe('string');

    // These are different types at compile time
    // const wrong: UserId = orderId; // Type error
  });
});

describe('Event System Integration', () => {
  it('should handle typed events', () => {
    interface AppEvents extends EventMap {
      'user:login': { userId: string; timestamp: number };
      'user:logout': { userId: string };
    }

    const eventMap: AppEvents = {
      'user:login': { userId: '123', timestamp: Date.now() },
      'user:logout': { userId: '123' },
    };

    expect(eventMap['user:login']).toBeDefined();
    expect(eventMap['user:logout']).toBeDefined();
  });

  it('should handle event handler type', () => {
    interface Events extends EventMap {
      'data:received': { data: string };
    }

    const handler: EventHandler<Events, 'data:received'> = (payload) => {
      expect(payload.data).toBeDefined();
    };

    handler({ data: 'test' });
  });
});

describe('Utility Types Integration', () => {
  it('should work with DeepPartial', () => {
    interface Config {
      api: {
        url: string;
        timeout: number;
      };
    }

    const partialConfig: DeepPartial<Config> = {
      api: {
        url: 'https://api.example.com',
      },
    };

    expect(partialConfig.api?.url).toBe('https://api.example.com');
  });

  it('should work with MaybePromise', () => {
    function getData(): MaybePromise<string> {
      return 'sync data';
    }

    function getAsyncData(): MaybePromise<string> {
      return Promise.resolve('async data');
    }

    expect(getData()).toBe('sync data');

    getAsyncData().then((data) => {
      expect(data).toBe('async data');
    });
  });
});
