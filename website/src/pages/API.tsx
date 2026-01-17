import { CodeBlock } from '@/components/common/CodeBlock';

export function API() {
  const resultTypeCode = `type Result<T, E> = Ok<T> | Err<E>;

interface Ok<T> {
  readonly ok: true;
  readonly value: T;

  map<U>(fn: (value: T) => U): Result<U, never>;
  mapErr<F>(fn: (error: never) => F): Ok<T>;
  match<U>(handlers: { ok: (value: T) => U; err: (error: never) => U }): U;
  unwrap(): T;
  unwrapOr(defaultValue: T): T;
  unwrapOrElse(fn: () => T): T;
}`;

  const factoryFunctionsCode = `function Ok<T>(value: T): Ok<T>;
function Err<E>(error: E): Err<E>;

// Usage
const success = Ok(42);
const failure = Err('Something went wrong');`;

  const typeGuardsCode = `function isOk<T>(result: Result<T, unknown>): result is Ok<T>;
function isErr<E>(result: Result<unknown, E>): result is Err<E>;
function isResult<T, E>(value: unknown): value is Result<T, E>;

// Usage
if (isOk(result)) {
  console.log(result.value); // TypeScript knows it's Ok
}`;

  const utilityTypesCode = `// Object manipulation
type ValueOf<T> = T[keyof T];
type RequireKeys<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>;
type OptionalKeys<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
type KeysOfType<T, V> = { [K in keyof T]: T[K] extends V ? K : never }[keyof T];
type NonNullish<T> = Exclude<T, null | undefined>;
type Mutable<T> = { -readonly [P in keyof T]: T[P] };
type DeepMutable<T> = T extends object ? { -readonly [P in keyof T]: DeepMutable<T[P]> } : T;

// Array utilities
type Tuple<T, N extends number> = /* Fixed-length tuple */;
type ArrayElement<T extends readonly unknown[]> = T[number];
type LiteralUnion<T extends U, U = string> = T | (U & { _brand?: never });`;

  const utilityExamplesCode = `// Extract value types from object
const colors = { red: '#ff0000', green: '#00ff00' } as const;
type ColorValue = ValueOf<typeof colors>; // '#ff0000' | '#00ff00'

// Make specific keys required
interface User { id?: string; name?: string; }
type UserWithId = RequireKeys<User, 'id'>; // { id: string; name?: string }

// Fixed-length tuples
type Point2D = Tuple<number, 2>; // [number, number]
type RGB = Tuple<number, 3>; // [number, number, number]`;

  return (
    <div className="container max-w-screen-2xl mx-auto px-4 py-12">
      <div className="max-w-3xl">
        <h1 className="text-4xl font-bold mb-6">API Reference</h1>
        <p className="text-xl text-muted-foreground mb-12">
          Complete API documentation for @oxog/types.
        </p>

        <div className="space-y-12">
          <section>
            <h2 className="text-3xl font-bold mb-4">Result Type</h2>
            <p className="text-muted-foreground mb-4">
              The Result type represents either success (Ok) or failure (Err):
            </p>
            <CodeBlock code={resultTypeCode} language="typescript" />
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-4">Factory Functions</h2>
            <p className="text-muted-foreground mb-4">
              Create Ok and Err instances:
            </p>
            <CodeBlock code={factoryFunctionsCode} language="typescript" />
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-4">Type Guards</h2>
            <p className="text-muted-foreground mb-4">
              Runtime type checking for Result types:
            </p>
            <CodeBlock code={typeGuardsCode} language="typescript" />
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-4">Utility Types</h2>
            <p className="text-muted-foreground mb-4">
              Powerful type utilities for object manipulation, arrays, and more:
            </p>
            <CodeBlock code={utilityTypesCode} language="typescript" />
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-4">Utility Examples</h2>
            <p className="text-muted-foreground mb-4">
              Practical examples of utility types in action:
            </p>
            <CodeBlock code={utilityExamplesCode} language="typescript" />
          </section>
        </div>
      </div>
    </div>
  );
}
