/**
 * Example 13: Non Empty Array
 *
 * This example demonstrates the NonEmptyArray utility type.
 */

import type { NonEmptyArray } from '@oxog/types';

console.log('=== Example 13: Non Empty Array ===\n');

// Example 1: Basic non-empty array
const numbers: NonEmptyArray<number> = [1];
const strings: NonEmptyArray<string> = ['hello', 'world'];
const mixed: NonEmptyArray<unknown> = [1, 'string', true, null];

console.log('1. Basic NonEmptyArrays:');
console.log('  numbers:', numbers);
console.log('  strings:', strings);
console.log('  mixed:', mixed);

// Example 2: Accessing first element
const users: NonEmptyArray<string> = ['Alice', 'Bob', 'Charlie'];

const firstUser = users[0];
console.log('\n2. First element access:');
console.log('  firstUser:', firstUser);

// TypeScript knows array has at least one element
function getFirstElement<T>(arr: NonEmptyArray<T>): T {
  return arr[0];
}

const first = getFirstElement(users);
console.log('  getFirstElement result:', first);

// Example 3: Tuples with NonEmptyArray
const coordinates: NonEmptyArray<[number, number]> = [
  [0, 0],
  [10, 20],
  [30, 40],
];

console.log('\n3. Tuple array:');
console.log('  coordinates:', coordinates);

// Example 4: Required at least one element
function sum(numbers: NonEmptyArray<number>): number {
  return numbers.reduce((a, b) => a + b, 0);
}

const sum1 = sum([42]);
const sum2 = sum([1, 2, 3, 4, 5]);

console.log('\n4. Sum function:');
console.log('  sum1:', sum1);
console.log('  sum2:', sum2);

// Example 5: Type-safe list operations
function head<T>(arr: NonEmptyArray<T>): T {
  return arr[0];
}

function tail<T>(arr: NonEmptyArray<T>): T[] {
  return arr.slice(1);
}

const list: NonEmptyArray<string> = ['first', 'second', 'third'];

console.log('\n5. Head and tail:');
console.log('  head:', head(list));
console.log('  tail:', tail(list));

// Example 6: Prepend element (keeps non-empty)
function cons<T>(head: T, tail: T[]): NonEmptyArray<T> {
  return [head, ...tail];
}

const newList = cons('zero', ['one', 'two']);
console.log('\n6. Prepend (cons):');
console.log('  newList:', newList);

// Example 7: Safe array construction
function createNonEmptyArray<T>(...items: T[]): NonEmptyArray<T> {
  if (items.length === 0) {
    throw new Error('Array must not be empty');
  }
  return items as NonEmptyArray<T>;
}

try {
  const arr1 = createNonEmptyArray(1, 2, 3);
  console.log('\n7. Safe construction:');
  console.log('  arr1:', arr1);
} catch (error) {
  console.log('\n7. Construction error:', error);
}

// Example 8: API endpoints
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';
type Route = {
  method: HttpMethod;
  path: string;
  handlers: NonEmptyArray<(req: unknown) => unknown>;
};

const routes: Route[] = [
  {
    method: 'GET',
    path: '/users',
    handlers: [
      (req) => ({ status: 200, data: [] }),
    ],
  },
  {
    method: 'POST',
    path: '/users',
    handlers: [
      (req) => ({ status: 400, error: 'Invalid' }),
      (req) => ({ status: 500, error: 'Server error' }),
    ],
  },
];

console.log('\n8. Route handlers:');
routes.forEach((route) => {
  console.log(`  ${route.method} ${route.path}: ${route.handlers.length} handler(s)`);
});

// Example 9: Middleware chain
type Middleware = (req: unknown, res: unknown, next: () => void) => void;
type MiddlewareChain = NonEmptyArray<Middleware>;

function createMiddlewareChain(...middleware: Middleware[]): MiddlewareChain {
  if (middleware.length === 0) {
    throw new Error('At least one middleware required');
  }
  return middleware as MiddlewareChain;
}

const chain = createMiddlewareChain(
  (req, res, next) => console.log('1. Auth'),
  (req, res, next) => console.log('2. Validation'),
  (req, res, next) => console.log('3. Handler')
);

console.log('\n9. Middleware chain:');
console.log('  Chain length:', chain.length);
chain[0]({}, {}, () => {});

// Example 10: Configuration array
type DatabaseConfig = {
  host: string;
  port: number;
};

type ConfigArray = NonEmptyArray<DatabaseConfig>;

const dbConfigs: ConfigArray = [
  { host: 'primary.db.com', port: 5432 },
  { host: 'secondary.db.com', port: 5432 },
];

console.log('\n10. Database configuration:');
console.log('  Primary:', dbConfigs[0]);
console.log('  Secondary:', dbConfigs[1]);

// Example 11: Error handling
function processArray<T>(arr: NonEmptyArray<T>): T {
  if (arr.length === 0) {
    // This branch is unreachable due to type system
    throw new Error('Empty array');
  }
  return arr[0];
}

const result = processArray([42]);
console.log('\n11. Process array:');
console.log('  result:', result);

// Example 12: Array comparison
function compareArrays<T>(a: NonEmptyArray<T>, b: NonEmptyArray<T>): number {
  return a.length - b.length;
}

const comp1 = compareArrays([1], [1, 2, 3]);
const comp2 = compareArrays([1, 2, 3], [1]);

console.log('\n12. Array comparison:');
console.log('  comp1:', comp1);
console.log('  comp2:', comp2);

// Example 13: Mapping with guarantee
const values: NonEmptyArray<number> = [1, 2, 3, 4, 5];

const doubled = values.map((n) => n * 2);
console.log('\n13. Mapping:');
console.log('  original:', values);
console.log('  doubled:', doubled);

// Example 14: Reduce with initial value
const scores: NonEmptyArray<number> = [85, 92, 78, 95, 88];

const average = scores.reduce((sum, score) => sum + score, 0) / scores.length;
console.log('\n14. Average calculation:');
console.log('  scores:', scores);
console.log('  average:', average);

// Example 15: Type predicate
function isNonEmptyArray<T>(arr: T[]): arr is NonEmptyArray<T> {
  return arr.length > 0;
}

const testArrays = [
  [1],
  [],
  ['a', 'b'],
];

console.log('\n15. Array checking:');
testArrays.forEach((arr) => {
  console.log(`  ${JSON.stringify(arr)}: ${isNonEmptyArray(arr) ? 'Non-empty' : 'Empty'}`);
});

console.log('\n=== End Example 13 ===\n');
