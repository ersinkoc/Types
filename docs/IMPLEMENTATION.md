# @oxog/types - Implementation Guide

## Architecture Overview

The @oxog/types package is designed as the foundational type system for a micro-kernel plugin ecosystem. This document outlines the implementation strategy, architecture decisions, and technical approach.

## Module Organization

### Core Modules

#### 1. plugin.ts
**Purpose:** Plugin and Kernel interfaces
**Exports:** `Plugin`, `Kernel`, `PluginOptions`, `PluginLogger`

**Design Decisions:**
- Generic `TContext` parameter allows packages to extend with custom context
- Kernel methods return `this` for chaining
- Plugin lifecycle hooks use `MaybePromise` for flexibility
- All plugin properties are readonly for immutability

**Implementation Strategy:**
```typescript
// Kernel is purely an interface - packages implement it
export interface Kernel<TContext = unknown> {
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

#### 2. result.ts
**Purpose:** Rust-style Result type for error handling
**Exports:** `Result`, `Ok`, `Err`, `Ok`, `Err` constructors, helper functions

**Design Decisions:**
- Union type `Result<T, E> = Ok<T> | Err<E>` for type safety
- Each variant has specific methods to prevent incorrect usage
- `map` only available on Ok, `mapErr` only on Err
- `match` provides exhaustiveness checking

**Implementation Strategy:**
```typescript
// Concrete classes for proper prototype chains
export class OkImpl<T> implements Ok<T> {
  constructor(public readonly value: T) {}
  readonly ok = true as const;
  readonly error = undefined;
  // ... methods
}

export class ErrImpl<E> implements Err<E> {
  constructor(public readonly error: E) {}
  readonly ok = false as const;
  readonly value = undefined;
  // ... methods
}

export function Ok<T>(value: T): Ok<T> {
  return new OkImpl(value);
}

export function Err<E>(error: E): Err<E> {
  return new ErrImpl(error);
}
```

#### 3. errors.ts
**Purpose:** Standardized error classes
**Exports:** `OxogError`, `ValidationError`, `PluginError`, `ErrorCodes`

**Design Decisions:**
- Inheritance hierarchy for error types
- Context object for additional error details
- Error codes for programmatic handling
- Extends native Error with additional properties

**Implementation Strategy:**
```typescript
export class OxogError extends Error {
  public readonly name = 'OxogError';
  constructor(
    message: string,
    public readonly code: string,
    public readonly context?: Record<string, unknown>
  ) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export enum ErrorCodes {
  UNKNOWN = 'UNKNOWN',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  PLUGIN_ERROR = 'PLUGIN_ERROR',
  NOT_FOUND = 'NOT_FOUND',
  TIMEOUT = 'TIMEOUT',
  DEPENDENCY_ERROR = 'DEPENDENCY_ERROR'
}
```

#### 4. guards.ts
**Purpose:** Runtime type checking
**Exports:** Type guard functions for all public types

**Design Decisions:**
- Narrow type predicates for compile-time safety
- Check prototype chain for proper inheritance
- Handle null/undefined gracefully
- Exhaustive type checking

**Implementation Strategy:**
```typescript
export function isPlugin<T>(value: unknown): value is Plugin<T> {
  return value !== null
    && typeof value === 'object'
    && typeof (value as Plugin<T>).name === 'string'
    && typeof (value as Plugin<T>).version === 'string'
    && typeof (value as Plugin<T>).install === 'function';
}

export function isOk<T>(value: Result<T, unknown>): value is Ok<T> {
  return value !== null && typeof value === 'object' && value.ok === true;
}
```

#### 5. events.ts
**Purpose:** Type-safe event system
**Exports:** `EventMap`, `EventHandler`, `TypedEventEmitter`, `Unsubscribe`

**Design Decisions:**
- EventMap as index signature for extensibility
- Generic EventHandler for type-safe payloads
- TypedEventEmitter interface for packages to implement
- Unsubscribe function for cleanup

**Implementation Strategy:**
```typescript
export interface EventMap {
  [event: string]: unknown;
}

export type EventHandler<
  TEvents extends EventMap,
  K extends keyof TEvents
> = (payload: TEvents[K]) => void;

export interface TypedEventEmitter<TEvents extends EventMap> {
  on<K extends keyof TEvents>(event: K, handler: EventHandler<TEvents, K>): Unsubscribe;
  off<K extends keyof TEvents>(event: K, handler: EventHandler<TEvents, K>): void;
  emit<K extends keyof TEvents>(event: K, payload: TEvents[K]): void;
  once<K extends keyof TEvents>(event: K, handler: EventHandler<TEvents, K>): Unsubscribe;
}
```

#### 6. utils.ts
**Purpose:** Common TypeScript utility types
**Exports:** All utility types

**Design Decisions:**
- Brand symbol for branded types
- Deep utilities using conditional types
- JSON types for API compatibility
- Strict utilities for exact type checking

**Implementation Strategy:**
```typescript
// Brand symbol
declare const __brand: unique symbol;
export type Branded<T, B extends string> = T & { readonly [__brand]: B };
export type Brand<T, B extends string> = Branded<T, B>;

// Deep utilities
export type DeepPartial<T> = T extends object
  ? { [P in keyof T]?: DeepPartial<T[P]> }
  : T;

// JSON types
export type JsonPrimitive = string | number | boolean | null;
export type JsonArray = JsonValue[];
export type JsonObject = { [key: string]: JsonValue };
export type JsonValue = JsonPrimitive | JsonArray | JsonObject;
```

#### 7. constants.ts
**Purpose:** Well-known symbols and constants
**Exports:** Symbols, version, error codes

**Design Decisions:**
- Unique symbols for brand checking
- Frozen objects for immutability
- Enum for error codes
- Version constant for introspection

**Implementation Strategy:**
```typescript
export const OXOG_PLUGIN = Symbol.for('@oxog/plugin');
export const OXOG_KERNEL = Symbol.for('@oxog/kernel');
export const OXOG_VERSION = '1.0.0';

export enum ErrorCodes {
  UNKNOWN = 'UNKNOWN',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  PLUGIN_ERROR = 'PLUGIN_ERROR',
  NOT_FOUND = 'NOT_FOUND',
  TIMEOUT = 'TIMEOUT',
  DEPENDENCY_ERROR = 'DEPENDENCY_ERROR'
}
```

#### 8. index.ts
**Purpose:** Main entry point
**Exports:** All public APIs

**Design Decisions:**
- Barrel export for clean imports
- Re-export from all modules
- Type-only exports where appropriate
- Organized by category

**Implementation Strategy:**
```typescript
// Re-export everything
export * from './plugin';
export * from './result';
export * from './errors';
export * from './guards';
export * from './events';
export * from './utils';
export * from './constants';

// Named exports for specific use cases
export { OxogError as default } from './errors';
```

## Build Configuration

### TypeScript Configuration
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitOverride": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "outDir": "./dist",
    "rootDir": "./src",
    "skipLibCheck": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "tests"]
}
```

### TSup Configuration
```typescript
import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  treeshake: true,
  minify: true,
  bundle: true,
  metafile: true,
  target: 'es2022',
  platform: 'neutral'
});
```

### Vitest Configuration
```typescript
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      threshold: {
        global: {
          branches: 100,
          functions: 100,
          lines: 100,
          statements: 100
        }
      }
    }
  }
});
```

## Testing Strategy

### Unit Tests
- **plugin.test.ts** - Test Plugin and Kernel interfaces
- **result.test.ts** - Test Result type, Ok, Err, and helpers
- **errors.test.ts** - Test error classes and codes
- **guards.test.ts** - Test all type guards
- **utils.test.ts** - Test utility types

### Integration Tests
- **ecosystem.test.ts** - Test how types work together

### Coverage Requirements
- **Branches:** 100%
- **Functions:** 100%
- **Lines:** 100%
- **Statements:** 100%

### Test Patterns
```typescript
describe('Result', () => {
  describe('Ok', () => {
    it('should create Ok instance', () => {
      const ok = Ok(42);
      expect(isOk(ok)).toBe(true);
      expect(isErr(ok)).toBe(false);
      expect(ok.value).toBe(42);
    });

    it('should map values', () => {
      const ok = Ok(42);
      const mapped = ok.map(x => x * 2);
      expect(isOk(mapped)).toBe(true);
      expect(mapped.value).toBe(84);
    });
  });

  describe('Err', () => {
    it('should create Err instance', () => {
      const err = Err('error');
      expect(isOk(err)).toBe(false);
      expect(isErr(err)).toBe(true);
      expect(err.error).toBe('error');
    });
  });
});
```

## Bundle Size Optimization

### Target Sizes
- **Core (ESM):** < 2KB gzipped
- **All (ESM + CJS + DTS):** < 3KB gzipped

### Optimization Strategies
1. **Tree Shaking** - Enable in tsup config
2. **Code Splitting** - Not needed, single entry point
3. **Minification** - Minify in production builds
4. **Dead Code Elimination** - Remove unused exports

### Bundle Analysis
```bash
npm run build
npx tsup --metafile
# Check dist for .metafile.json
```

## Type Safety

### Strict Mode Requirements
- `strict: true` - Enable all strict type checking
- `noUncheckedIndexedAccess` - Prevent array access without checking
- `noImplicitOverride` - Require explicit override keywords

### Type Assertions
- Avoid `as` and `<>` type assertions
- Use type guards for runtime checking
- Use branded types for type-safe IDs

### Generic Constraints
```typescript
// Good: Generic with constraint
function getPlugin<T extends Plugin>(kernel: Kernel, name: string): T | undefined {
  return kernel.getPlugin(name) as T | undefined;
}

// Bad: Generic without constraint
function identity<T>(value: T): T {
  return value as T; // No assertion needed
}
```

## JSDoc Documentation

### Requirements
- Every public API must have JSDoc
- Include @example for complex APIs
- Use proper @param and @return tags
- Include @since, @deprecated when relevant

### Example
```typescript
/**
 * Creates a successful Result containing a value.
 *
 * @example
 * ```typescript
 * const result = Ok(42);
 * if (isOk(result)) {
 *   console.log(result.value); // 42
 * }
 * ```
 *
 * @param value - The value to wrap
 * @returns An Ok result containing the value
 */
export function Ok<T>(value: T): Ok<T> {
  return new OkImpl(value);
}
```

## Performance Considerations

### Type Checking
- Avoid complex conditional types in hot paths
- Use infer for type extraction
- Cache complex type computations

### Runtime Performance
- Use symbols for brand checking (fast)
- Avoid Object.keys() in guards
- Use typeof and instanceof checks

### Bundle Performance
- Re-export from modules to enable tree-shaking
- Avoid default exports (harder to tree-shake)
- Use const assertions where possible

## Error Handling Strategy

### Result Type Usage
```typescript
// Good: Use Result for error handling
function parseJSON(input: string): Result<unknown, string> {
  try {
    return Ok(JSON.parse(input));
  } catch {
    return Err('Invalid JSON');
  }
}

// Bad: Throw exceptions
function parseJSON(input: string): unknown {
  return JSON.parse(input); // Can throw
}
```

### Error Hierarchy
```typescript
// Base error for all @oxog errors
class OxogError extends Error { /* ... */ }

// Specific error types
class ValidationError extends OxogError { /* ... */ }
class PluginError extends OxogError { /* ... */ }
```

## Compatibility Strategy

### Node.js
- Minimum version: 18 (for native ESM support)
- Target: ES2022 features
- Platform: neutral (works in Node and browser)

### TypeScript
- Minimum version: 5.0
- Strict mode required
- Declaration files generated

### Module Formats
- **ESM:** Primary format for modern bundlers
- **CJS:** Backward compatibility
- **DTS:** TypeScript declaration files

## Quality Assurance

### Pre-commit Checks
1. TypeScript compilation
2. ESLint validation
3. Prettier formatting
4. Unit tests
5. Coverage report

### Pre-publish Checklist
- [ ] All tests pass
- [ ] Coverage is 100%
- [ ] No TypeScript errors
- [ ] Build succeeds
- [ ] Bundle size under limits
- [ ] JSDoc complete
- [ ] Examples run
- [ ] README updated

## Future Extensibility

### Plugin System
- Context can be extended with custom properties
- Events can be extended with new types
- Plugin lifecycle can add new hooks

### Result Type
- Can add new methods while maintaining compatibility
- Can add new helper functions
- Existing code won't break

### Utility Types
- Can add new utilities without breaking changes
- Deep utilities can handle new TypeScript features
- JSON types can extend with new standards

This implementation guide ensures the @oxog/types package is production-ready, type-safe, and maintainable.
