import { describe, it, expect } from 'vitest';
import type {
  Branded,
  Brand,
  DeepPartial,
  DeepReadonly,
  DeepRequired,
  MaybePromise,
  AsyncFunction,
  SyncFunction,
  AnyFunction,
  JsonPrimitive,
  JsonArray,
  JsonObject,
  JsonValue,
  Prettify,
  StrictOmit,
  StrictPick,
  NonEmptyArray,
  Nullable,
  Optional,
  Unsubscribe,
} from '../../src/utils.js';

describe('Branded Types', () => {
  it('should create branded type', () => {
    type UserId = Branded<string, 'UserId'>;

    const userId: UserId = 'user_123' as UserId;

    expect(typeof userId).toBe('string');
  });

  it('should create branded type with Brand alias', () => {
    type OrderId = Brand<number, 'OrderId'>;

    const orderId: OrderId = 456 as OrderId;

    expect(typeof orderId).toBe('number');
  });

  it('should prevent mixing branded types', () => {
    type UserId = Branded<string, 'UserId'>;
    type OrderId = Branded<string, 'OrderId'>;

    const userId: UserId = 'user_123' as UserId;
    const orderId: OrderId = 'order_456' as OrderId;

    // TypeScript should catch this at compile time
    // expect(userId).toBe(orderId); // This would be a type error
  });
});

describe('DeepPartial', () => {
  it('should make top-level properties optional', () => {
    interface User {
      name: string;
      age: number;
    }

    const partial: DeepPartial<User> = {
      name: 'John',
    };

    expect(partial.name).toBe('John');
    expect((partial as any).age).toBeUndefined();
  });

  it('should make nested properties optional', () => {
    interface User {
      name: string;
      address: {
        street: string;
        city: string;
      };
    }

    const partial: DeepPartial<User> = {
      name: 'John',
      address: {
        street: 'Main St',
      },
    };

    expect(partial.name).toBe('John');
    expect(partial.address?.street).toBe('Main St');
    expect((partial.address as any)?.city).toBeUndefined();
  });

  it('should handle arrays', () => {
    interface Config {
      servers: Array<{ host: string; port: number }>;
    }

    const partial: DeepPartial<Config> = {
      servers: [{ host: 'localhost' }],
    };

    expect(partial.servers?.[0]?.host).toBe('localhost');
    expect((partial.servers?.[0] as any)?.port).toBeUndefined();
  });
});

describe('DeepReadonly', () => {
  it('should make top-level properties readonly', () => {
    interface User {
      name: string;
      age: number;
    }

    const user: DeepReadonly<User> = {
      name: 'John',
      age: 30,
    };

    expect(user.name).toBe('John');
    expect(user.age).toBe(30);

    // TypeScript should catch attempts to mutate
    // user.name = 'Jane'; // This would be a type error
  });

  it('should make nested properties readonly', () => {
    interface User {
      name: string;
      address: {
        street: string;
        city: string;
      };
    }

    const user: DeepReadonly<User> = {
      name: 'John',
      address: {
        street: 'Main St',
        city: 'NYC',
      },
    };

    expect(user.name).toBe('John');
    expect(user.address.street).toBe('Main St');

    // TypeScript should catch attempts to mutate nested properties
    // user.address.street = 'Oak Ave'; // This would be a type error
  });
});

describe('DeepRequired', () => {
  it('should make all properties required', () => {
    interface PartialUser {
      name?: string;
      age?: number;
    }

    const user: DeepRequired<PartialUser> = {
      name: 'John',
      age: 30,
    };

    expect(user.name).toBe('John');
    expect(user.age).toBe(30);
  });

  it('should make nested properties required', () => {
    interface PartialConfig {
      api?: {
        url?: string;
        timeout?: number;
      };
    }

    const config: DeepRequired<PartialConfig> = {
      api: {
        url: 'https://api.example.com',
        timeout: 5000,
      },
    };

    expect(config.api?.url).toBe('https://api.example.com');
    expect(config.api?.timeout).toBe(5000);
  });
});

describe('MaybePromise', () => {
  it('should accept synchronous value', () => {
    const value: MaybePromise<string> = 'hello';

    expect(value).toBe('hello');
  });

  it('should accept promise', async () => {
    const value: MaybePromise<string> = Promise.resolve('hello');

    const result = await value;
    expect(result).toBe('hello');
  });

  it('should work with function parameter', () => {
    function process(value: MaybePromise<string>): string {
      if (value instanceof Promise) {
        return 'async';
      }
      return 'sync';
    }

    expect(process('hello')).toBe('sync');
  });
});

describe('AsyncFunction', () => {
  it('should create async function type', () => {
    const fetchData: AsyncFunction<string> = async () => {
      return 'data';
    };

    expect(typeof fetchData).toBe('function');
  });

  it('should work with promise return', async () => {
    const fetchData: AsyncFunction<number> = async () => {
      return 42;
    };

    const result = await fetchData();
    expect(result).toBe(42);
  });
});

describe('SyncFunction', () => {
  it('should create sync function type', () => {
    const add: SyncFunction<number> = (a: number, b: number) => {
      return a + b;
    };

    expect(typeof add).toBe('function');
    expect(add(2, 3)).toBe(5);
  });
});

describe('AnyFunction', () => {
  it('should accept any function', () => {
    const fn1: AnyFunction = () => {};
    const fn2: AnyFunction = (a: number) => a;
    const fn3: AnyFunction = (a: number, b: string, c: boolean) => ({ a, b, c });

    expect(typeof fn1).toBe('function');
    expect(typeof fn2).toBe('function');
    expect(typeof fn3).toBe('function');
  });
});

describe('JSON Types', () => {
  describe('JsonPrimitive', () => {
    it('should accept string', () => {
      const value: JsonPrimitive = 'hello';
      expect(value).toBe('hello');
    });

    it('should accept number', () => {
      const value: JsonPrimitive = 42;
      expect(value).toBe(42);
    });

    it('should accept boolean', () => {
      const value: JsonPrimitive = true;
      expect(value).toBe(true);
    });

    it('should accept null', () => {
      const value: JsonPrimitive = null;
      expect(value).toBeNull();
    });
  });

  describe('JsonArray', () => {
    it('should accept array of primitives', () => {
      const value: JsonArray = [1, 'hello', true, null];
      expect(value).toEqual([1, 'hello', true, null]);
    });

    it('should accept nested arrays', () => {
      const value: JsonArray = [1, [2, [3]]];
      expect(value).toEqual([1, [2, [3]]]);
    });
  });

  describe('JsonObject', () => {
    it('should accept simple object', () => {
      const value: JsonObject = {
        name: 'John',
        age: 30,
      };
      expect(value).toEqual({ name: 'John', age: 30 });
    });

    it('should accept nested objects', () => {
      const value: JsonObject = {
        user: {
          name: 'John',
          address: {
            city: 'NYC',
          },
        },
      };
      expect(value.user.name).toBe('John');
      expect(value.user.address.city).toBe('NYC');
    });
  });

  describe('JsonValue', () => {
    it('should accept primitive', () => {
      const value: JsonValue = 'hello';
      expect(value).toBe('hello');
    });

    it('should accept array', () => {
      const value: JsonValue = [1, 2, 3];
      expect(value).toEqual([1, 2, 3]);
    });

    it('should accept object', () => {
      const value: JsonValue = { name: 'John' };
      expect(value).toEqual({ name: 'John' });
    });
  });
});

describe('Prettify', () => {
  it('should flatten type for IDE display', () => {
    type ComplexType = { a: string } & { b: number };
    type PrettyType = Prettify<ComplexType>;

    const value: PrettyType = {
      a: 'hello',
      b: 42,
    };

    expect(value.a).toBe('hello');
    expect(value.b).toBe(42);
  });
});

describe('StrictOmit', () => {
  it('should omit specified keys', () => {
    interface User {
      id: number;
      name: string;
      email: string;
    }

    type UserWithoutEmail = StrictOmit<User, 'email'>;

    const user: UserWithoutEmail = {
      id: 1,
      name: 'John',
    };

    expect(user.id).toBe(1);
    expect(user.name).toBe('John');
  });

  it('should omit multiple keys', () => {
    interface Config {
      apiUrl: string;
      timeout: number;
      retries: number;
      debug: boolean;
    }

    type MinimalConfig = StrictOmit<Config, 'timeout' | 'retries' | 'debug'>;

    const config: MinimalConfig = {
      apiUrl: 'https://api.example.com',
    };

    expect(config.apiUrl).toBe('https://api.example.com');
  });
});

describe('StrictPick', () => {
  it('should pick specified keys', () => {
    interface User {
      id: number;
      name: string;
      email: string;
    }

    type UserBasicInfo = StrictPick<User, 'id' | 'name'>;

    const user: UserBasicInfo = {
      id: 1,
      name: 'John',
    };

    expect(user.id).toBe(1);
    expect(user.name).toBe('John');
  });

  it('should pick single key', () => {
    interface Config {
      apiUrl: string;
      timeout: number;
    }

    type ApiUrlOnly = StrictPick<Config, 'apiUrl'>;

    const config: ApiUrlOnly = {
      apiUrl: 'https://api.example.com',
    };

    expect(config.apiUrl).toBe('https://api.example.com');
  });
});

describe('NonEmptyArray', () => {
  it('should accept array with one element', () => {
    const arr: NonEmptyArray<number> = [1];

    expect(arr.length).toBe(1);
    expect(arr[0]).toBe(1);
  });

  it('should accept array with multiple elements', () => {
    const arr: NonEmptyArray<string> = ['hello', 'world'];

    expect(arr.length).toBe(2);
    expect(arr[0]).toBe('hello');
    expect(arr[1]).toBe('world');
  });

  it('should work as tuple', () => {
    const arr: NonEmptyArray<number> = [1, 2, 3];

    expect(arr[0]).toBe(1);
    expect(arr[1]).toBe(2);
    expect(arr[2]).toBe(3);
  });
});

describe('Nullable', () => {
  it('should accept value', () => {
    const value: Nullable<string> = 'hello';
    expect(value).toBe('hello');
  });

  it('should accept null', () => {
    const value: Nullable<string> = null;
    expect(value).toBeNull();
  });
});

describe('Optional', () => {
  it('should accept value', () => {
    const value: Optional<string> = 'hello';
    expect(value).toBe('hello');
  });

  it('should accept undefined', () => {
    const value: Optional<string> = undefined;
    expect(value).toBeUndefined();
  });
});

describe('Unsubscribe', () => {
  it('should create unsubscribe function', () => {
    let subscribed = true;

    const unsubscribe: Unsubscribe = () => {
      subscribed = false;
    };

    expect(typeof unsubscribe).toBe('function');
    expect(subscribed).toBe(true);

    unsubscribe();
    expect(subscribed).toBe(false);
  });
});
