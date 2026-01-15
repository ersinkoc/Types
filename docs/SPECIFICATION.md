# @oxog/types - Specification

## Package Identity

- **Name:** @oxog/types
- **Version:** 1.0.0
- **Description:** Shared TypeScript types, interfaces, and utilities for the @oxog ecosystem
- **Author:** Ersin Koç
- **License:** MIT
- **Runtime Dependencies:** 0 (zero)

## Architecture Overview

The @oxog/types package implements a micro-kernel plugin architecture with the following components:

1. **Plugin System** - Standard plugin interface for extensibility
2. **Kernel Interface** - Micro-kernel that manages plugins and events
3. **Result Type** - Rust-style functional error handling
4. **Error Classes** - Standardized error hierarchy
5. **Type Guards** - Runtime type checking
6. **Utility Types** - Common TypeScript utilities
7. **Event System** - Type-safe event handling
8. **Constants & Symbols** - Well-known identifiers

## Core Interfaces

### Plugin Interface

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

### Kernel Interface

```typescript
interface Kernel<TContext = unknown> {
  use(plugin: Plugin<TContext>): this;
  unregister(name: string): boolean;
  getPlugin<T extends Plugin<TContext>>(name: string): T | undefined;
  listPlugins(): ReadonlyArray<Plugin<TContext>>;
  hasPlugin(name: string): boolean;
  emit<K extends string>(event: K, payload?: unknown): void;
  on<K extends string>(event: K, handler: (payload: unknown) => void): Unsubscribe;
  getContext(): TContext;
}
```

### Result Type

```typescript
type Result<T, E> = Ok<T> | Err<E>;

interface Ok<T> {
  readonly ok: true;
  readonly value: T;
  map<U>(fn: (value: T) => U): Result<U, never>;
  mapErr<F>(fn: (error: never) => F): Ok<T>;
  match<U>(handlers: { ok: (value: T) => U; err: (error: never) => U }): U;
  unwrap(): T;
  unwrapOr(defaultValue: T): T;
  unwrapOrElse(fn: () => T): T;
}

interface Err<E> {
  readonly ok: false;
  readonly error: E;
  map<U>(fn: (value: never) => U): Err<E>;
  mapErr<F>(fn: (error: E) => F): Result<never, F>;
  match<U>(handlers: { ok: (value: never) => U; err: (error: E) => U }): U;
  unwrap(): never;
  unwrapOr<T>(defaultValue: T): T;
  unwrapOrElse<T>(fn: () => T): T;
}
```

### Error Classes

```typescript
class OxogError extends Error {
  constructor(
    message: string,
    readonly code: string,
    readonly context?: Record<string, unknown>
  );
}

class ValidationError extends OxogError {
  constructor(message: string, readonly context?: Record<string, unknown>);
}

class PluginError extends OxogError {
  constructor(
    message: string,
    readonly pluginName: string,
    readonly context?: Record<string, unknown>
  );
}
```

## Type Guards

Runtime type checking functions for all public types:

- `isPlugin<T>(value: unknown): value is Plugin<T>`
- `isKernel<T>(value: unknown): value is Kernel<T>`
- `isOxogError(value: unknown): value is OxogError`
- `isValidationError(value: unknown): value is ValidationError`
- `isPluginError(value: unknown): value is PluginError`
- `isResult<T, E>(value: unknown): value is Result<T, E>`
- `isOk<T>(value: Result<T, unknown>): value is Ok<T>`
- `isErr<E>(value: Result<unknown, E>): value is Err<E>`

## Utility Types

### Branded Types
- `Branded<T, B extends string>` - Creates branded types for type-safe IDs
- `Brand<T, B extends string>` - Shorthand for Branded

### Deep Utilities
- `DeepPartial<T>` - All nested properties optional
- `DeepReadonly<T>` - All nested properties readonly
- `DeepRequired<T>` - All nested properties required

### Function Types
- `MaybePromise<T>` - Value that may be a promise
- `AsyncFunction<T>` - Async function type
- `SyncFunction<T>` - Sync function type
- `AnyFunction` - Any function type

### JSON Types
- `JsonPrimitive` - string | number | boolean | null
- `JsonArray` - JsonValue[]
- `JsonObject` - { [key: string]: JsonValue }
- `JsonValue` - JsonPrimitive | JsonArray | JsonObject

### Object Utilities
- `Prettify<T>` - Make type prettier in IDE
- `StrictOmit<T, K extends keyof T>` - Strict omit with valid keys
- `StrictPick<T, K extends keyof T>` - Strict pick with valid keys
- `NonEmptyArray<T>` - Array with at least one element
- `Nullable<T>` - T | null
- `Optional<T>` - T | undefined

### Events
- `EventMap` - Base event map interface
- `EventHandler<TEvents, K>` - Event handler for specific event
- `TypedEventEmitter<TEvents>` - Type-safe event emitter
- `Unsubscribe` - () => void

### Constants
- `OXOG_PLUGIN` - Well-known symbol for plugins
- `OXOG_KERNEL` - Well-known symbol for kernels
- `OXOG_VERSION` - Package version
- `ErrorCodes` - Enum of standard error codes

## Technical Requirements

- **Runtime:** Universal (Node.js + Browser)
- **Module Format:** ESM + CJS
- **Node.js:** >= 18
- **TypeScript:** >= 5.0
- **Bundle Size:** < 2KB core, < 3KB all (gzipped)
- **Test Coverage:** 100%

## Development Requirements

### Dependencies Policy
- **Runtime Dependencies:** 0 (ZERO)
- **DevDependencies:** Only testing, building, and linting tools

### Build Configuration
- TypeScript strict mode enabled
- ES2022 target
- ESNext module
- Bundler module resolution

### Testing
- Vitest for testing
- 100% coverage requirement
- Unit tests for all modules
- Integration tests for ecosystem

### Documentation
- LLM-native design
- llms.txt file (< 2000 tokens)
- 15+ examples
- Rich JSDoc with @example

## API Design Principles

1. **Predictable** - Consistent naming and behavior
2. **Type-Safe** - Full TypeScript coverage with strict mode
3. **Functional** - Result type promotes functional error handling
4. **Composable** - All types work together seamlessly
5. **Minimal** - Zero runtime dependencies
6. **Well-Documented** - Comprehensive examples and JSDoc

## Error Codes

Standard error codes for consistent error handling:
- `UNKNOWN` - Unknown error
- `VALIDATION_ERROR` - Validation failed
- `PLUGIN_ERROR` - Plugin-related error
- `NOT_FOUND` - Resource not found
- `TIMEOUT` - Operation timed out
- `DEPENDENCY_ERROR` - Dependency issue

## Plugin Lifecycle

1. **Registration** - `kernel.use(plugin)` called
2. **Install** - `plugin.install(kernel)` called immediately
3. **Init** - `plugin.onInit(context)` called after all plugins
4. **Runtime** - Plugin handles events and operations
5. **Destroy** - `plugin.onDestroy()` called on unregister

## Event System

The kernel provides an event bus:
- Plugins can emit events via `kernel.emit(event, payload)`
- Plugins can subscribe via `kernel.on(event, handler)`
- Events are typed via EventMap interface
- Returns Unsubscribe function for cleanup

## Micro-Kernel Architecture

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

## Implementation Order

1. Create project structure
2. Set up configuration files
3. Implement core types (Plugin, Kernel)
4. Implement Result type
5. Implement Error classes
6. Implement Type guards
7. Implement Utility types
8. Implement Event types
9. Implement Constants
10. Create main index exports
11. Write comprehensive tests
12. Create examples
13. Create documentation
14. Verify coverage and build
