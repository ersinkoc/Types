/**
 * Example 08: JSON Types
 *
 * This example demonstrates JSON-compatible type definitions.
 */

import type { JsonPrimitive, JsonArray, JsonObject, JsonValue } from '@oxog/types';

console.log('=== Example 08: JSON Types ===\n');

// Example 1: JsonPrimitive
const primitives: JsonPrimitive[] = [
  'hello',
  42,
  true,
  null,
];

console.log('JsonPrimitive examples:');
primitives.forEach((p, i) => {
  console.log(`  [${i}]`, p, typeof p);
});

// Example 2: JsonArray
const arrays: JsonArray[] = [
  [1, 2, 3],
  ['a', 'b', 'c'],
  [true, false, null],
  [{ name: 'John' }, { name: 'Jane' }],
];

console.log('\nJsonArray examples:');
arrays.forEach((arr, i) => {
  console.log(`  [${i}]`, arr);
});

// Example 3: JsonObject
const objects: JsonObject[] = [
  { name: 'John', age: 30 },
  { active: true, tags: ['admin', 'user'] },
  { nested: { value: 42 }, 'special-key': 'value' },
];

console.log('\nJsonObject examples:');
objects.forEach((obj, i) => {
  console.log(`  [${i}]`, obj);
});

// Example 4: JsonValue - accepts any valid JSON
const jsonValues: JsonValue[] = [
  'string',
  123,
  true,
  null,
  [1, 2, 3],
  { key: 'value' },
  {
    user: {
      id: 1,
      name: 'Alice',
      active: true,
      tags: ['developer', 'designer'],
      metadata: null,
    },
  },
];

console.log('\nJsonValue examples (any valid JSON):');
jsonValues.forEach((val, i) => {
  console.log(`  [${i}]`, typeof val, Array.isArray(val) ? 'array' : val);
});

// Example 5: API Response types
interface ApiResponse<T> {
  status: 'success' | 'error';
  data: T;
  meta?: {
    page: number;
    perPage: number;
    total: number;
  };
}

type JsonApiResponse<T> = JsonObject & ApiResponse<T>;

const userResponse: JsonApiResponse<JsonObject> = {
  status: 'success',
  data: {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    active: true,
  },
  meta: {
    page: 1,
    perPage: 10,
    total: 100,
  },
};

console.log('\nAPI Response:', userResponse);

// Example 6: Configuration object
type JsonConfig = JsonObject & {
  database: {
    host: string;
    port: number;
    credentials: {
      username: string;
      password: string;
    };
  };
  cache: {
    enabled: boolean;
    ttl: number;
  };
  features: string[];
};

const config: JsonConfig = {
  database: {
    host: 'localhost',
    port: 5432,
    credentials: {
      username: 'admin',
      password: 'secret',
    },
  },
  cache: {
    enabled: true,
    ttl: 3600,
  },
  features: ['feature1', 'feature2'],
};

console.log('\nConfig:', config);

// Example 7: Serialize/Deserialize helpers
function isJsonValue(value: unknown): value is JsonValue {
  if (
    value === null ||
    typeof value === 'string' ||
    typeof value === 'number' ||
    typeof value === 'boolean'
  ) {
    return true;
  }

  if (Array.isArray(value)) {
    return value.every(isJsonValue);
  }

  if (typeof value === 'object') {
    return Object.values(value).every(isJsonValue);
  }

  return false;
}

const testValues = [
  'string',
  123,
  true,
  null,
  [1, 2, 3],
  { nested: { value: 42 } },
  () => {}, // Not JSON
  undefined, // Not JSON
];

console.log('\nValue validation:');
testValues.forEach((val) => {
  console.log(`  ${typeof val}: ${isJsonValue(val) ? '✓ Valid' : '✗ Invalid'} JSON`);
});

// Example 8: Deep clone for JSON
function jsonClone<T extends JsonValue>(value: T): T {
  return JSON.parse(JSON.stringify(value));
}

const original = {
  user: {
    id: 1,
    name: 'Alice',
    roles: ['admin', 'user'],
    settings: {
      theme: 'dark',
      notifications: true,
    },
  },
};

const cloned = jsonClone(original);

console.log('\nDeep clone:');
console.log('  Original:', original);
console.log('  Cloned:', cloned);
console.log('  Are equal:', JSON.stringify(original) === JSON.stringify(cloned));

// Example 9: JSON schema type
type JsonSchema = JsonObject & {
  type: 'object' | 'array' | 'string' | 'number' | 'boolean' | 'null';
  properties?: Record<string, JsonSchema>;
  items?: JsonSchema;
  required?: string[];
};

const objectSchema: JsonSchema = {
  type: 'object',
  properties: {
    id: { type: 'number' },
    name: { type: 'string' },
    active: { type: 'boolean' },
  },
  required: ['id', 'name'],
};

console.log('\nJSON Schema:', objectSchema);

// Example 10: Type-safe JSON storage
type StorageValue = JsonValue;

const storage = new Map<string, StorageValue>();

storage.set('user:123', {
  id: 123,
  name: 'John',
  preferences: {
    theme: 'dark',
    language: 'en',
  },
});

storage.set('config:app', {
  version: '1.0.0',
  debug: true,
  endpoints: ['/api/v1', '/api/v2'],
});

console.log('\nType-safe storage:');
storage.forEach((value, key) => {
  console.log(`  ${key}:`, value);
});

console.log('\n=== End Example 08 ===\n');
