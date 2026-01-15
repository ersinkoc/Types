/**
 * Example 09: MaybePromise
 *
 * This example demonstrates the MaybePromise utility for sync/async flexibility.
 */

import type { MaybePromise } from '@oxog/types';

console.log('=== Example 09: MaybePromise ===\n');

// Example 1: Function that can return sync or async
function getData(id: string): MaybePromise<string> {
  if (id === 'sync') {
    return 'Synchronous data';
  }
  return Promise.resolve('Asynchronous data');
}

console.log('1. Sync/Async function:');
getData('sync').then((data) => console.log('  sync result:', data));
getData('async').then((data) => console.log('  async result:', data));

// Example 2: Handler that accepts both sync and async
type EventHandler = (data: string) => MaybePromise<void>;

const syncHandler: EventHandler = (data) => {
  console.log('  Sync handler:', data);
};

const asyncHandler: EventHandler = async (data) => {
  await new Promise((resolve) => setTimeout(resolve, 100));
  console.log('  Async handler:', data);
};

console.log('\n2. Event handlers:');
syncHandler('test data');
asyncHandler('test data').then(() => {});

// Example 3: Data processor
function processData<T>(data: T): MaybePromise<T> {
  // Simulate cache check
  const hasCache = Math.random() > 0.5;

  if (hasCache) {
    return data; // Sync return
  }

  return Promise.resolve(data); // Async return
}

console.log('\n3. Data processing:');
processData(42).then((result) => console.log('  Result:', result));
processData('hello').then((result) => console.log('  Result:', result));

// Example 4: Validation function
function validate(input: string): MaybePromise<{ valid: boolean; error?: string }> {
  // Simple validation
  if (input.length === 0) {
    return { valid: false, error: 'Input is empty' };
  }

  // Async validation (e.g., database check)
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ valid: true });
    }, 100);
  });
}

console.log('\n4. Validation:');
validate('').then((result) => console.log('  Empty:', result));
validate('test').then((result) => console.log('  Valid:', result));

// Example 5: Configuration loader
type ConfigLoader = (key: string) => MaybePromise<string | undefined>;

const configLoader: ConfigLoader = (key) => {
  // Try memory cache first (sync)
  const cached = memoryCache.get(key);
  if (cached !== undefined) {
    return cached;
  }

  // Load from file (async)
  return loadFromFile(key);
};

const memoryCache = new Map<string, string>();

function loadFromFile(key: string): Promise<string | undefined> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(`loaded_${key}`);
    }, 50);
  });
}

console.log('\n5. Configuration loader:');
configLoader('test').then((value) => console.log('  Config value:', value));

// Example 6: User processor
interface User {
  id: number;
  name: string;
}

function fetchUser(id: number): MaybePromise<User | null> {
  if (id <= 0) {
    return null; // Sync return
  }

  return fetchUserFromAPI(id); // Async return
}

function fetchUserFromAPI(id: number): Promise<User | null> {
  return Promise.resolve({ id, name: `User ${id}` });
}

console.log('\n6. User processor:');
fetchUser(0).then((user) => console.log('  Invalid ID:', user));
fetchUser(123).then((user) => console.log('  Valid user:', user));

// Example 7: Middleware pattern
type Middleware = (req: Request) => MaybePromise<Response>;

const authMiddleware: Middleware = async (req) => {
  await new Promise((resolve) => setTimeout(resolve, 10));
  return { status: 'authorized', request: req } as Response;
};

const loggingMiddleware: Middleware = (req) => {
  console.log('  Logging request:', req.url);
  return { status: 'logged', request: req } as Response;
};

interface Request {
  url: string;
  method: string;
}

interface Response {
  status: string;
  request: Request;
}

console.log('\n7. Middleware:');
authMiddleware({ url: '/api/test', method: 'GET' }).then((res) => {
  console.log('  Auth result:', res.status);
});

loggingMiddleware({ url: '/api/data', method: 'POST' });

// Example 8: Form handler
type FormSubmitHandler = (
  data: Record<string, unknown>
) => MaybePromise<{ success: boolean; message: string }>;

const formHandler: FormSubmitHandler = (data) => {
  const hasValidationErrors = Object.keys(data).length === 0;

  if (hasValidationErrors) {
    return { success: false, message: 'Validation failed' };
  }

  return saveToDatabase(data);
};

function saveToDatabase(data: Record<string, unknown>): Promise<{ success: boolean; message: string }> {
  return Promise.resolve({ success: true, message: 'Saved successfully' });
}

console.log('\n8. Form handler:');
formHandler({ name: 'John', email: 'john@example.com' }).then((result) => {
  console.log('  Form result:', result);
});

formHandler({}).then((result) => {
  console.log('  Form result:', result);
});

// Example 9: Cache decorator
function withCache<T extends unknown[], R>(
  fn: (...args: T) => MaybePromise<R>
): (...args: T) => MaybePromise<R> {
  const cache = new Map<string, R>();

  return async (...args: T): Promise<R> => {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key)!;
    }

    const result = await fn(...args);
    cache.set(key, result);
    return result;
  };
}

const expensiveOperation = async (n: number): Promise<number> => {
  await new Promise((resolve) => setTimeout(resolve, 100));
  return n * 2;
};

const cachedOperation = withCache(expensiveOperation);

console.log('\n9. Cache decorator:');
cachedOperation(5).then((result) => console.log('  First call:', result));
cachedOperation(5).then((result) => console.log('  Cached call:', result));

// Example 10: Generic maybe promise
async function handleMaybePromise<T>(
  value: MaybePromise<T>
): Promise<{ isPromise: boolean; value: T }> {
  if (value instanceof Promise) {
    const result = await value;
    return { isPromise: true, value: result };
  }

  return { isPromise: false, value };
}

console.log('\n10. Generic handler:');
handleMaybePromise('sync').then((result) => console.log('  Sync:', result));
handleMaybePromise(Promise.resolve('async')).then((result) => console.log('  Async:', result));

console.log('\n=== End Example 09 ===\n');
