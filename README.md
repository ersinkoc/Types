# @oxog/types

**Shared TypeScript types, interfaces, and utilities for the @oxog ecosystem.**

[![npm version](https://img.shields.io/npm/v/@oxog/types.svg)](https://www.npmjs.com/package/@oxog/types)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)
[![Test Coverage](https://img.shields.io/badge/coverage-100%25-brightgreen.svg)](https://github.com/ersinkoc/types)
[![Bundle Size](https://img.shields.io/badge/bundle-<%203KB-gold.svg)](https://github.com/ersinkoc/types)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Overview

`@oxog/types` is the foundational package for the entire @oxog ecosystem. It provides:

- **Micro-kernel plugin architecture** - Standardized Plugin and Kernel interfaces
- **Functional error handling** - Rust-inspired Result type (Ok/Err)
- **Error classes** - OxogError, ValidationError, PluginError
- **Type guards** - Runtime type checking for all public types
- **Utility types** - Branded types, deep utilities, JSON types, and more
- **Event system** - Type-safe event handling primitives
- **Zero dependencies** - Pure TypeScript, no runtime dependencies

## Quick Start

```bash
npm install @oxog/types
```

```typescript
import { Plugin, Kernel, Result, Ok, Err, OxogError } from '@oxog/types';

// Example: Using Result type
function divide(a: number, b: number): Result<number, string> {
  if (b === 0) return Err('Division by zero');
  return Ok(a / b);
}

const result = divide(10, 2);
if (isOk(result)) {
  console.log(result.value); // 5
}

// Example: Creating a plugin
const myPlugin: Plugin = {
  name: 'my-plugin',
  version: '1.0.0',
  install(kernel) {
    kernel.on('event', (payload) => {
      console.log('Event received:', payload);
    });
  },
};

// Example: Error handling
throw new OxogError('Database error', ErrorCodes.DEPENDENCY_ERROR, {
  host: 'localhost',
  port: 5432,
});
```

## Features

### 1. Plugin System

Standard plugin interface for extensible applications:

```typescript
interface Plugin<TContext = unknown> {
  readonly name: string;
  readonly version: string;
  readonly dependencies?: readonly string[];
  install: (kernel: Kernel<TContext>) => void;
  onInit?: (context: TContext) => MaybePromise<void>;
  onDestroy?: () => MaybePromise<void>;
  onError?: (error: Error) => void;
}
```

### 2. Result Type

Rust-inspired functional error handling:

```typescript
type Result<T, E> = Ok<T> | Err<E>;

function parseInt(value: string): Result<number, string> {
  const num = Number(value);
  if (isNaN(num)) return Err('Not a number');
  return Ok(num);
}

const result = parseInt('42').map(n => n * 2);
if (isOk(result)) {
  console.log(result.value); // 84
}
```

### 3. Error Classes

Standardized error hierarchy:

```typescript
// Base error with code and context
throw new OxogError('Something went wrong', 'ERR_CODE', { userId: '123' });

// Validation errors
throw new ValidationError('Invalid email', { field: 'email', value: 'bad-email' });

// Plugin errors
throw new PluginError('Failed to initialize', 'cache-plugin', { reason: 'Redis down' });
```

### 4. Type Guards

Runtime type checking:

```typescript
if (isPlugin(obj)) {
  console.log(obj.name, obj.version); // TypeScript knows it's a Plugin
}

if (isValidationError(error)) {
  console.log(error.context?.field); // TypeScript knows it's a ValidationError
}
```

### 5. Branded Types

Type-safe identifiers:

```typescript
type UserId = Branded<string, 'UserId'>;
type OrderId = Branded<string, 'OrderId'>;

const userId: UserId = 'user_123' as UserId;
const orderId: OrderId = 'order_456' as OrderId;

// Type error: Type 'UserId' is not assignable to type 'OrderId'
const wrong: OrderId = userId;
```

### 6. Utility Types

Common TypeScript utilities:

```typescript
// Deep utilities
type PartialUser = DeepPartial<User>;

// JSON types
type ApiResponse = JsonValue;

// MaybePromise for sync/async flexibility
function getData(): MaybePromise<string> {
  return 'sync'; // or Promise.resolve('async')
}

// NonEmptyArray
const list: NonEmptyArray<number> = [1]; // At least one element
```

### 7. Event System

Type-safe event handling:

```typescript
interface AppEvents extends EventMap {
  'user:login': { userId: string; timestamp: number };
  'error': Error;
}

const handler: EventHandler<AppEvents, 'user:login'> = (payload) => {
  console.log(payload.userId, payload.timestamp);
};
```

## API Reference

### Core Interfaces

- `Plugin<TContext>` - Standard plugin interface
- `Kernel<TContext>` - Micro-kernel for plugin management
- `TypedEventEmitter<TEvents>` - Type-safe event emitter

### Result Type

- `Result<T, E>` - Union of Ok<T> or Err<E>
- `Ok<T>` - Successful result interface
- `Err<E>` - Failed result interface
- `Ok(value: T)` - Create successful result
- `Err(error: E)` - Create failed result
- `isOk(result)` - Type guard for Ok
- `isErr(result)` - Type guard for Err

### Error Classes

- `OxogError` - Base error class
- `ValidationError` - Validation errors
- `PluginError` - Plugin-specific errors
- `ErrorCodes` - Standard error codes enum

### Type Guards

- `isPlugin<T>(value)` - Check if value is Plugin
- `isKernel<T>(value)` - Check if value is Kernel
- `isOxogError(value)` - Check if value is OxogError
- `isValidationError(value)` - Check if value is ValidationError
- `isPluginError(value)` - Check if value is PluginError

### Utility Types

**Branded:**
- `Branded<T, B>` - Create branded type
- `Brand<T, B>` - Shorthand for Branded

**Deep:**
- `DeepPartial<T>` - All properties optional
- `DeepReadonly<T>` - All properties readonly
- `DeepRequired<T>` - All properties required
- `DeepMutable<T>` - All properties mutable (removes readonly)

**Function:**
- `MaybePromise<T>` - Sync or async value
- `AsyncFunction<T>` - Async function type
- `SyncFunction<T>` - Sync function type
- `AnyFunction` - Any function type

**JSON:**
- `JsonPrimitive` - string | number | boolean | null
- `JsonArray` - JsonValue[]
- `JsonObject` - { [key: string]: JsonValue }
- `JsonValue` - Any valid JSON value

**Object:**
- `Prettify<T>` - Flatten type for IDE
- `StrictOmit<T, K>` - Omit with key validation
- `StrictPick<T, K>` - Pick with key validation
- `NonEmptyArray<T>` - Array with ≥1 element
- `Nullable<T>` - T | null
- `Optional<T>` - T | undefined
- `ValueOf<T>` - Extract value types from object
- `RequireKeys<T, K>` - Make specific keys required
- `OptionalKeys<T, K>` - Make specific keys optional
- `KeysOfType<T, V>` - Extract keys with matching value type
- `NonNullish<T>` - Exclude null and undefined
- `Mutable<T>` - Remove readonly from properties

**Array:**
- `Tuple<T, N>` - Fixed-length tuple type
- `ArrayElement<T>` - Extract element type from array
- `LiteralUnion<T, U>` - Literal union with autocomplete

### Events

- `EventMap` - Base event map interface
- `EventHandler<TEvents, K>` - Event handler type
- `TypedEventEmitter<TEvents>` - Event emitter interface
- `Unsubscribe` - Cleanup function () => void

### Constants

- `OXOG_PLUGIN` - Well-known symbol for plugins
- `OXOG_KERNEL` - Well-known symbol for kernels
- `OXOG_VERSION` - Package version string
- `ErrorCodes` - Standard error codes

## Examples

The package includes 15 comprehensive examples:

1. **Basic Plugin** - Creating and using plugins
2. **Result Type** - Functional error handling
3. **Error Handling** - Error classes and patterns
4. **Type Guards** - Runtime type checking
5. **Branded Types** - Type-safe identifiers
6. **Deep Utilities** - Nested type transformations
7. **Event Types** - Type-safe events
8. **JSON Types** - JSON-compatible types
9. **MaybePromise** - Sync/async flexibility
10. **Kernel Interface** - Micro-kernel usage
11. **Plugin Options** - Configuration and logging
12. **Strict Pick/Omit** - Type-safe property selection
13. **Non Empty Array** - Guaranteed non-empty arrays
14. **Typed Emitter** - Event emitter implementation
15. **Real World** - Full integration example

Run examples:
```bash
npm run example:01-basic-plugin
npm run example:02-result-type
# ... and more
```

## Technical Details

### Requirements

- Node.js >= 18
- TypeScript >= 5.0
- Strict mode enabled

### Build

- ES2022 target
- ESM + CJS module formats
- TypeScript declaration files
- Tree-shaking enabled
- < 3KB gzipped

### Testing

- 100% code coverage
- 229 tests across 7 test files
- Unit tests for all modules
- Integration tests
- Vitest test runner

### Bundle Size

- Core: < 2KB gzipped
- All (ESM + CJS + DTS): < 3KB gzipped

## Architecture

```
┌─────────────────────────────────────┐
│          User Application            │
├─────────────────────────────────────┤
│      Plugin Registry Interface       │
│   use() · register() · unregister()  │
├──────┬──────┬──────┬────────────────┤
│ Core │ Opt. │Import│   Community    │
│      │      │      │                │
├──────┴──────┴──────┴────────────────┤
│         Micro Kernel                 │
│  Event Bus · Lifecycle · Errors     │
└─────────────────────────────────────┘
```

## Error Codes

Standard error codes for consistent handling:

- `UNKNOWN` - Unknown error
- `VALIDATION_ERROR` - Validation failed
- `PLUGIN_ERROR` - Plugin-related error
- `NOT_FOUND` - Resource not found
- `TIMEOUT` - Operation timed out
- `DEPENDENCY_ERROR` - Dependency issue

## Use Cases

### Functional Error Handling

```typescript
function fetchUser(id: string): Result<User, string> {
  if (!id) return Err('ID required');
  return Ok({ id, name: 'John' });
}
```

### Plugin Architecture

```typescript
const logger: Plugin = {
  name: 'logger',
  version: '1.0.0',
  install(kernel) {
    kernel.on('log', (message) => console.log(message));
  },
};
```

### Type-Safe APIs

```typescript
type UserId = Branded<string, 'UserId'>;

interface UserAPI {
  getUser(id: UserId): Promise<User>;
  createUser(data: StrictOmit<User, 'id'>): Promise<UserId>;
}
```

### Event-Driven Architecture

```typescript
interface AppEvents extends EventMap {
  'user:login': { userId: string };
  'order:placed': { orderId: string; amount: number };
}
```

## Ecosystem

All @oxog packages depend on `@oxog/types` for consistency:

- `@oxog/core` - Core micro-kernel implementation
- `@oxog/cli` - Command-line tools
- `@oxog/utils` - Utility functions

## Contributing

Contributions welcome! Please read our contributing guidelines.

## License

MIT License - see LICENSE file for details.

## Author

**Ersin Koç**

- GitHub: [@ersinkoc](https://github.com/ersinkoc)
- Website: [https://types.oxog.dev](https://types.oxog.dev)

## Links

- [Documentation](https://types.oxog.dev)
- [GitHub](https://github.com/ersinkoc/types)
- [npm](https://www.npmjs.com/package/@oxog/types)
