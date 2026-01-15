# Types - @oxog NPM Package

## Package Identity

| Field | Value |
|-------|-------|
| **npm** | `@oxog/types` |
| **GitHub** | `https://github.com/ersinkoc/types` |
| **Website** | `https://types.oxog.dev` |
| **Author** | Ersin Koç |
| **License** | MIT |

> NO social media, Discord, email, or external links.

---

## Description

**One-line:** Shared TypeScript types, interfaces, and utilities for the @oxog ecosystem.

`@oxog/types` is the foundation package for the entire @oxog ecosystem. It provides the core type definitions for the micro-kernel plugin architecture, error handling primitives, Result type for functional error handling, and common utility types. Every @oxog package depends on this package for type consistency.

---

## @oxog Dependencies

This package has **zero dependencies** (not even @oxog packages). It is the root of the dependency tree.

---

## NON-NEGOTIABLE RULES

### 1. DEPENDENCY POLICY

```json
{
  "dependencies": {}
}
```

- **ZERO runtime dependencies** - this is the root package
- NO external packages
- Implement everything from scratch

**Allowed devDependencies:**
```json
{
  "devDependencies": {
    "typescript": "^5.0.0",
    "vitest": "^2.0.0",
    "@vitest/coverage-v8": "^2.0.0",
    "tsup": "^8.0.0",
    "@types/node": "^20.0.0",
    "prettier": "^3.0.0",
    "eslint": "^9.0.0"
  }
}
```

### 2. 100% TEST COVERAGE

- Every line, branch, function tested
- All tests must pass
- Use Vitest
- Thresholds enforced in config

### 3. MICRO-KERNEL ARCHITECTURE

This package defines the architecture interfaces that all other packages implement:

```
┌─────────────────────────────────────────────────┐
│                   User Code                      │
├─────────────────────────────────────────────────┤
│             Plugin Registry API                  │
│    use() · register() · unregister() · list()   │
├──────────┬──────────┬──────────┬────────────────┤
│  Core    │ Optional │ Imported │   Community    │
│ Plugins  │ Plugins  │ Plugins  │    Plugins     │
├──────────┴──────────┴──────────┴────────────────┤
│                 Micro Kernel                     │
│     Event Bus · Lifecycle · Error Boundary      │
└─────────────────────────────────────────────────┘
```

### 4. DEVELOPMENT WORKFLOW

Create these documents FIRST:

1. **SPECIFICATION.md** - Complete spec
2. **IMPLEMENTATION.md** - Architecture
3. **TASKS.md** - Ordered task list

Only then implement code following TASKS.md.

### 5. TYPESCRIPT STRICT MODE

```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitOverride": true,
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler"
  }
}
```

### 6. LLM-NATIVE DESIGN

- `llms.txt` file (< 2000 tokens)
- Predictable API naming
- Rich JSDoc with @example
- Minimum 15 examples
- README optimized for LLMs

---

## CORE FEATURES

### 1. Plugin Interface

The standard plugin interface that all @oxog plugins must implement.

```typescript
import type { Plugin, Kernel } from '@oxog/types';

const myPlugin: Plugin = {
  name: 'my-plugin',
  version: '1.0.0',
  dependencies: ['logger'],
  install(kernel) {
    kernel.on('init', () => console.log('Plugin installed'));
  },
  onInit(context) {
    // Called after all plugins installed
  },
  onDestroy() {
    // Cleanup
  },
  onError(error) {
    console.error('Plugin error:', error);
  }
};
```

### 2. Kernel Interface

The micro-kernel interface that all @oxog packages implement.

```typescript
import type { Kernel, Plugin } from '@oxog/types';

interface MyKernel extends Kernel<MyContext> {
  // Package-specific extensions
  process(input: string): string;
}

// Kernel methods:
// - use(plugin): Register plugin
// - unregister(name): Remove plugin
// - getPlugin(name): Get plugin by name
// - listPlugins(): List all plugins
// - hasPlugin(name): Check if registered
// - emit(event, payload): Emit event
// - on(event, handler): Subscribe to event
// - getContext(): Get shared context
```

### 3. Error Classes

Standardized error classes for consistent error handling across the ecosystem.

```typescript
import { OxogError, ValidationError, PluginError } from '@oxog/types';

// Base error with code and context
throw new OxogError('Something went wrong', 'ERR_UNKNOWN', { 
  userId: '123' 
});

// Validation errors
throw new ValidationError('Invalid email format', { 
  field: 'email', 
  value: 'not-an-email' 
});

// Plugin-specific errors
throw new PluginError('Failed to initialize', 'cache-plugin', {
  reason: 'Redis connection failed'
});
```

### 4. Result Type

Rust-style Result type for functional error handling without exceptions.

```typescript
import { Result, Ok, Err, isOk, isErr } from '@oxog/types';

function divide(a: number, b: number): Result<number, string> {
  if (b === 0) {
    return Err('Division by zero');
  }
  return Ok(a / b);
}

const result = divide(10, 2);

if (isOk(result)) {
  console.log('Value:', result.value); // 5
}

if (isErr(result)) {
  console.log('Error:', result.error);
}

// Pattern matching style
const message = result.match({
  ok: (value) => `Result: ${value}`,
  err: (error) => `Error: ${error}`
});

// Chaining
const doubled = result
  .map(x => x * 2)
  .mapErr(e => `Calculation failed: ${e}`);

// Unwrap with default
const value = result.unwrapOr(0);
```

### 5. Type Guards

Runtime type checking functions for @oxog types.

```typescript
import { 
  isPlugin, 
  isKernel, 
  isOxogError, 
  isValidationError,
  isPluginError,
  isResult,
  isOk,
  isErr
} from '@oxog/types';

// Check if object is a valid Plugin
if (isPlugin(obj)) {
  console.log(obj.name, obj.version);
}

// Check error types
try {
  doSomething();
} catch (error) {
  if (isValidationError(error)) {
    console.log('Validation failed:', error.context);
  } else if (isPluginError(error)) {
    console.log('Plugin error in:', error.context?.pluginName);
  } else if (isOxogError(error)) {
    console.log('Oxog error:', error.code);
  }
}
```

### 6. Utility Types

Common TypeScript utility types used across the ecosystem.

```typescript
import type {
  // Branded types for type-safe IDs
  Brand,
  Branded,
  
  // Deep utilities
  DeepPartial,
  DeepReadonly,
  DeepRequired,
  
  // Function types
  MaybePromise,
  AsyncFunction,
  SyncFunction,
  AnyFunction,
  
  // JSON types
  JsonPrimitive,
  JsonArray,
  JsonObject,
  JsonValue,
  
  // Object utilities
  Prettify,
  StrictOmit,
  StrictPick,
  NonEmptyArray,
  
  // Nullable
  Nullable,
  Optional,
} from '@oxog/types';

// Branded types for type-safe IDs
type UserId = Branded<string, 'UserId'>;
type OrderId = Branded<string, 'OrderId'>;

const userId: UserId = 'user_123' as UserId;
const orderId: OrderId = 'order_456' as OrderId;

// This would be a type error:
// const wrong: UserId = orderId;

// MaybePromise for sync/async flexibility
type Handler = (data: string) => MaybePromise<void>;

const syncHandler: Handler = (data) => console.log(data);
const asyncHandler: Handler = async (data) => await save(data);
```

### 7. Event Types

Type-safe event handling primitives.

```typescript
import type { 
  EventMap, 
  EventHandler, 
  Unsubscribe,
  TypedEventEmitter
} from '@oxog/types';

// Define your event map
interface MyEvents extends EventMap {
  'user:login': { userId: string; timestamp: number };
  'user:logout': { userId: string };
  'error': Error;
}

// Type-safe event handler
const handler: EventHandler<MyEvents, 'user:login'> = (payload) => {
  console.log(payload.userId, payload.timestamp);
};

// Typed event emitter interface
interface MyEmitter extends TypedEventEmitter<MyEvents> {}
```

### 8. Constants & Symbols

Well-known symbols and constants for the ecosystem.

```typescript
import { 
  OXOG_PLUGIN,
  OXOG_KERNEL,
  OXOG_VERSION,
  ErrorCodes
} from '@oxog/types';

// Check if object is @oxog plugin
if (obj[OXOG_PLUGIN] === true) {
  // It's a plugin
}

// Error codes
throw new OxogError('Not found', ErrorCodes.NOT_FOUND);

// ErrorCodes enum:
// - UNKNOWN
// - VALIDATION_ERROR
// - PLUGIN_ERROR
// - NOT_FOUND
// - TIMEOUT
// - DEPENDENCY_ERROR
```

---

## TYPE DEFINITIONS

### Plugin System

```typescript
/**
 * Standard plugin interface for @oxog ecosystem.
 */
export interface Plugin<TContext = unknown> {
  /** Unique plugin identifier (kebab-case) */
  readonly name: string;
  
  /** Semantic version */
  readonly version: string;
  
  /** Plugin dependencies by name */
  readonly dependencies?: readonly string[];
  
  /** Called when plugin is registered */
  install: (kernel: Kernel<TContext>) => void;
  
  /** Called after ALL plugins are installed */
  onInit?: (context: TContext) => MaybePromise<void>;
  
  /** Called when plugin is unregistered */
  onDestroy?: () => MaybePromise<void>;
  
  /** Called when an error occurs in this plugin */
  onError?: (error: Error) => void;
}

/**
 * Micro-kernel interface for @oxog packages.
 */
export interface Kernel<TContext = unknown> {
  /** Register a plugin */
  use(plugin: Plugin<TContext>): this;
  
  /** Unregister a plugin by name */
  unregister(name: string): boolean;
  
  /** Get registered plugin by name */
  getPlugin<T extends Plugin<TContext> = Plugin<TContext>>(name: string): T | undefined;
  
  /** List all registered plugins */
  listPlugins(): ReadonlyArray<Plugin<TContext>>;
  
  /** Check if plugin is registered */
  hasPlugin(name: string): boolean;
  
  /** Emit event to all plugins */
  emit<K extends string>(event: K, payload?: unknown): void;
  
  /** Subscribe to kernel events */
  on<K extends string>(event: K, handler: (payload: unknown) => void): Unsubscribe;
  
  /** Get shared context */
  getContext(): TContext;
}

/**
 * Plugin options for configuration.
 */
export interface PluginOptions {
  /** Whether to enable debug mode */
  debug?: boolean;
  
  /** Custom logger */
  logger?: PluginLogger;
}

/**
 * Plugin logger interface.
 */
export interface PluginLogger {
  debug(message: string, ...args: unknown[]): void;
  info(message: string, ...args: unknown[]): void;
  warn(message: string, ...args: unknown[]): void;
  error(message: string, ...args: unknown[]): void;
}
```

### Result Type

```typescript
/**
 * Represents a successful result.
 */
export interface Ok<T> {
  readonly ok: true;
  readonly value: T;
  readonly error?: never;
  
  map<U>(fn: (value: T) => U): Result<U, never>;
  mapErr<F>(fn: (error: never) => F): Ok<T>;
  match<U>(handlers: { ok: (value: T) => U; err: (error: never) => U }): U;
  unwrap(): T;
  unwrapOr(defaultValue: T): T;
  unwrapOrElse(fn: () => T): T;
}

/**
 * Represents a failed result.
 */
export interface Err<E> {
  readonly ok: false;
  readonly value?: never;
  readonly error: E;
  
  map<U>(fn: (value: never) => U): Err<E>;
  mapErr<F>(fn: (error: E) => F): Result<never, F>;
  match<U>(handlers: { ok: (value: never) => U; err: (error: E) => U }): U;
  unwrap(): never;
  unwrapOr<T>(defaultValue: T): T;
  unwrapOrElse<T>(fn: () => T): T;
}

/**
 * Result type - either Ok<T> or Err<E>.
 */
export type Result<T, E> = Ok<T> | Err<E>;
```

### Utility Types

```typescript
/** Brand symbol for branded types */
declare const __brand: unique symbol;

/** Creates a branded type */
export type Branded<T, B extends string> = T & { readonly [__brand]: B };

/** Shorthand for Branded */
export type Brand<T, B extends string> = Branded<T, B>;

/** Deep partial - all nested properties optional */
export type DeepPartial<T> = T extends object
  ? { [P in keyof T]?: DeepPartial<T[P]> }
  : T;

/** Deep readonly - all nested properties readonly */
export type DeepReadonly<T> = T extends object
  ? { readonly [P in keyof T]: DeepReadonly<T[P]> }
  : T;

/** Deep required - all nested properties required */
export type DeepRequired<T> = T extends object
  ? { [P in keyof T]-?: DeepRequired<T[P]> }
  : T;

/** Value that may be a promise */
export type MaybePromise<T> = T | Promise<T>;

/** Any function type */
export type AnyFunction = (...args: any[]) => any;

/** Async function type */
export type AsyncFunction<T = unknown> = (...args: any[]) => Promise<T>;

/** Sync function type */
export type SyncFunction<T = unknown> = (...args: any[]) => T;

/** JSON primitive types */
export type JsonPrimitive = string | number | boolean | null;

/** JSON array type */
export type JsonArray = JsonValue[];

/** JSON object type */
export type JsonObject = { [key: string]: JsonValue };

/** Any valid JSON value */
export type JsonValue = JsonPrimitive | JsonArray | JsonObject;

/** Make type prettier in IDE */
export type Prettify<T> = { [K in keyof T]: T[K] } & {};

/** Strict omit that requires valid keys */
export type StrictOmit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

/** Strict pick that requires valid keys */
export type StrictPick<T, K extends keyof T> = Pick<T, K>;

/** Array with at least one element */
export type NonEmptyArray<T> = [T, ...T[]];

/** Value that can be null */
export type Nullable<T> = T | null;

/** Value that can be undefined */
export type Optional<T> = T | undefined;

/** Unsubscribe function returned by event subscriptions */
export type Unsubscribe = () => void;
```

### Event Types

```typescript
/** Base event map interface */
export interface EventMap {
  [event: string]: unknown;
}

/** Event handler for a specific event */
export type EventHandler<
  TEvents extends EventMap,
  K extends keyof TEvents
> = (payload: TEvents[K]) => void;

/** Typed event emitter interface */
export interface TypedEventEmitter<TEvents extends EventMap> {
  on<K extends keyof TEvents>(event: K, handler: EventHandler<TEvents, K>): Unsubscribe;
  off<K extends keyof TEvents>(event: K, handler: EventHandler<TEvents, K>): void;
  emit<K extends keyof TEvents>(event: K, payload: TEvents[K]): void;
  once<K extends keyof TEvents>(event: K, handler: EventHandler<TEvents, K>): Unsubscribe;
}
```

---

## TECHNICAL REQUIREMENTS

| Requirement | Value |
|-------------|-------|
| Runtime | Universal (Node.js + Browser) |
| Module Format | ESM + CJS |
| Node.js | >= 18 |
| TypeScript | >= 5.0 |
| Bundle (core) | < 2KB gzipped |
| Bundle (all) | < 3KB gzipped |

---

## PROJECT STRUCTURE

```
types/
├── .github/workflows/
│   ├── deploy.yml
│   └── publish.yml
├── src/
│   ├── index.ts           # Main exports
│   ├── plugin.ts          # Plugin & Kernel interfaces
│   ├── result.ts          # Result type & Ok/Err
│   ├── errors.ts          # Error classes
│   ├── guards.ts          # Type guard functions
│   ├── events.ts          # Event types
│   ├── utils.ts           # Utility types
│   └── constants.ts       # Symbols & constants
├── tests/
│   ├── unit/
│   │   ├── plugin.test.ts
│   │   ├── result.test.ts
│   │   ├── errors.test.ts
│   │   ├── guards.test.ts
│   │   └── utils.test.ts
│   └── integration/
│       └── ecosystem.test.ts
├── examples/
│   ├── 01-basic-plugin/
│   ├── 02-result-type/
│   ├── 03-error-handling/
│   ├── 04-type-guards/
│   ├── 05-branded-types/
│   ├── 06-deep-utilities/
│   ├── 07-event-types/
│   ├── 08-json-types/
│   ├── 09-maybe-promise/
│   ├── 10-kernel-interface/
│   ├── 11-plugin-options/
│   ├── 12-strict-pick-omit/
│   ├── 13-non-empty-array/
│   ├── 14-typed-emitter/
│   └── 15-real-world/
├── website/
│   ├── public/CNAME
│   └── src/
├── llms.txt
├── SPECIFICATION.md
├── IMPLEMENTATION.md
├── TASKS.md
├── README.md
├── package.json
├── tsconfig.json
├── tsup.config.ts
├── vitest.config.ts
├── .prettierrc
├── eslint.config.js
└── .gitignore
```

---

## GITHUB WORKFLOWS

### deploy.yml (Website)

```yaml
name: Deploy Website

on:
  push:
    branches: [main]

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run test:coverage
      - run: npm run build
      - working-directory: ./website
        run: npm ci && npm run build
      - uses: actions/configure-pages@v4
      - uses: actions/upload-pages-artifact@v3
        with:
          path: './website/dist'
  
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - uses: actions/deploy-pages@v4
        id: deployment
```

### publish.yml (npm)

```yaml
name: Publish to npm

on:
  push:
    tags: ['v*']

permissions:
  contents: read
  id-token: write

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          registry-url: 'https://registry.npmjs.org'
      - run: npm ci
      - run: npm run test:coverage
      - run: npm run build
      - run: npm publish --provenance --access public
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

---

## WEBSITE REQUIREMENTS

- React 19 + Vite 6 + Tailwind CSS v4
- @oxog/codeshine for syntax highlighting (or Shiki if codeshine not ready)
- shadcn/ui components
- Lucide React icons
- JetBrains Mono + Inter fonts
- CNAME: types.oxog.dev
- Footer: "Made with ❤️ by Ersin KOÇ"
- GitHub link only (no social media)

### Pages

1. **Home** - Overview, quick start, key features
2. **Plugin Types** - Plugin, Kernel, PluginOptions
3. **Result Type** - Ok, Err, Result with examples
4. **Errors** - Error classes and usage
5. **Type Guards** - All guard functions
6. **Utility Types** - Complete reference
7. **Events** - Event system types
8. **Examples** - Interactive examples
9. **API Reference** - Full API documentation

---

## IMPLEMENTATION CHECKLIST

### Before Starting
- [ ] Create SPECIFICATION.md
- [ ] Create IMPLEMENTATION.md
- [ ] Create TASKS.md

### During Implementation
- [ ] Follow TASKS.md sequentially
- [ ] Write tests with each feature
- [ ] Maintain 100% coverage
- [ ] JSDoc on every public API

### Package Completion
- [ ] All tests passing (100%)
- [ ] Coverage at 100%
- [ ] No TypeScript errors
- [ ] Package builds

### LLM-Native Completion
- [ ] llms.txt created (< 2000 tokens)
- [ ] README optimized
- [ ] 15+ examples
- [ ] 8-12 npm keywords

### Website Completion
- [ ] All pages implemented
- [ ] Syntax highlighting integrated
- [ ] Dark/Light theme
- [ ] CNAME configured

### Final
- [ ] `npm run build` succeeds
- [ ] `npm run test:coverage` shows 100%
- [ ] Website builds
- [ ] All examples run

---

## BEGIN IMPLEMENTATION

Start with **SPECIFICATION.md**, then **IMPLEMENTATION.md**, then **TASKS.md**.

Only after all three documents are complete, implement code following TASKS.md sequentially.

**Remember:**
- Production-ready for npm publish
- ZERO runtime dependencies (this is root package)
- 100% test coverage
- LLM-native design
- Beautiful documentation website
