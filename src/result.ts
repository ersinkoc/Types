/**
 * @oxog/types - Result type for functional error handling
 * @version 1.0.1
 * @author Ersin Koç
 */

/**
 * Represents a successful result.
 *
 * Contains a value and provides methods for transforming the value
 * or handling errors. Only available on successful results.
 *
 * @example
 * ```typescript
 * const ok = Ok(42);
 * if (isOk(ok)) {
 *   console.log(ok.value); // 42
 * }
 * ```
 */
export interface Ok<T> {
  readonly ok: true;
  readonly value: T;
  readonly error?: never;

  /** Transform the value if successful */
  map<U>(fn: (value: T) => U): Result<U, never>;

  /** Transform the error (no-op for Ok) */
  mapErr<F>(fn: (error: never) => F): Ok<T>;

  /** Pattern matching for both cases */
  match<U>(handlers: { ok: (value: T) => U; err: (error: never) => U }): U;

  /** Unwrap the value (asserts success) */
  unwrap(): T;

  /** Unwrap with default value */
  unwrapOr(defaultValue: T): T;

  /** Unwrap using a fallback function */
  unwrapOrElse(fn: () => T): T;
}

/**
 * Represents a failed result.
 *
 * Contains an error and provides methods for transforming the error
 * or handling success cases. Only available on failed results.
 *
 * @example
 * ```typescript
 * const err = Err('Something went wrong');
 * if (isErr(err)) {
 *   console.log(err.error); // 'Something went wrong'
 * }
 * ```
 */
export interface Err<E> {
  readonly ok: false;
  readonly value?: never;
  readonly error: E;

  /** Transform the value (no-op for Err) */
  map<U>(fn: (value: never) => U): Err<E>;

  /** Transform the error if failed */
  mapErr<F>(fn: (error: E) => F): Result<never, F>;

  /** Pattern matching for both cases */
  match<U>(handlers: { ok: (value: never) => U; err: (error: E) => U }): U;

  /** Unwrap the value (asserts success, throws for Err) */
  unwrap(): never;

  /** Unwrap with default value */
  unwrapOr<T>(defaultValue: T): T;

  /** Unwrap using a fallback function */
  unwrapOrElse<T>(fn: () => T): T;
}

/**
 * Result type - either Ok<T> or Err<E>.
 *
 * A type that represents either success (Ok) or failure (Err).
 * This is inspired by Rust's Result type and provides functional
 * error handling without exceptions.
 *
 * @example
 * ```typescript
 * function divide(a: number, b: number): Result<number, string> {
 *   if (b === 0) {
 *     return Err('Division by zero');
 *   }
 *   return Ok(a / b);
 * }
 *
 * const result = divide(10, 2);
 *
 * // Pattern matching
 * const message = result.match({
 *   ok: (value) => `Result: ${value}`,
 *   err: (error) => `Error: ${error}`
 * });
 *
 * // Chaining
 * const doubled = result
 *   .map(x => x * 2)
 *   .mapErr(e => `Calculation failed: ${e}`);
 * ```
 */
export type Result<T, E> = Ok<T> | Err<E>;

/**
 * Internal implementation of Ok result.
 */
class OkImpl<T> implements Ok<T> {
  readonly ok = true as const;
  readonly error = undefined as never;

  constructor(public readonly value: T) {}

  map<U>(fn: (value: T) => U): Result<U, never> {
    return Ok(fn(this.value));
  }

  mapErr<F>(_fn: (error: never) => F): Ok<T> {
    return this;
  }

  match<U>(handlers: { ok: (value: T) => U; err: (error: never) => U }): U {
    return handlers.ok(this.value);
  }

  unwrap(): T {
    return this.value;
  }

  unwrapOr(_defaultValue: T): T {
    return this.value;
  }

  unwrapOrElse(_fn: () => T): T {
    return this.value;
  }
}

/**
 * Internal implementation of Err result.
 */
class ErrImpl<E> implements Err<E> {
  readonly ok = false as const;
  readonly value = undefined as never;

  constructor(public readonly error: E) {}

  map<U>(_fn: (value: never) => U): Err<E> {
    return this;
  }

  mapErr<F>(fn: (error: E) => F): Result<never, F> {
    return Err(fn(this.error));
  }

  match<U>(handlers: { ok: (value: never) => U; err: (error: E) => U }): U {
    return handlers.err(this.error);
  }

  unwrap(): never {
    throw new Error(`Cannot unwrap Err: ${String(this.error)}`);
  }

  unwrapOr<T>(defaultValue: T): T {
    return defaultValue;
  }

  unwrapOrElse<T>(fn: (error: E) => T): T {
    return fn(this.error);
  }
}

/**
 * Creates a successful Result containing a value.
 *
 * @example
 * ```typescript
 * const ok = Ok(42);
 * const okStr = Ok('hello');
 * const okObj = Ok({ id: 1 });
 * ```
 *
 * @param value - The value to wrap
 * @returns An Ok result containing the value
 */
export function Ok<T>(value: T): Ok<T> {
  return new OkImpl(value);
}

/**
 * Creates a failed Result containing an error.
 *
 * @example
 * ```typescript
 * const err = Err('Something went wrong');
 * const errNum = Err(404);
 * const errObj = Err({ code: 'NOT_FOUND' });
 * ```
 *
 * @param error - The error to wrap
 * @returns An Err result containing the error
 */
export function Err<E>(error: E): Err<E> {
  return new ErrImpl(error);
}
