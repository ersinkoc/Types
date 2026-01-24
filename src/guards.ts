/**
 * @oxog/types - Type guard functions
 * @version 1.0.3
 * @author Ersin Koç
 */

import type { Plugin, Kernel } from './plugin.js';
import type { Result, Ok, Err } from './result.js';
import { OxogError, ValidationError, PluginError } from './errors.js';

/**
 * Type guard for Plugin.
 *
 * Checks if a value is a valid Plugin instance.
 * Note: This cannot verify the specific context type T at runtime.
 *
 * @example
 * ```typescript
 * const plugin = { name: 'test', version: '1.0.0', install: () => {} };
 * if (isPlugin(plugin)) {
 *   console.log(plugin.name); // TypeScript knows it's a Plugin
 * }
 * ```
 */
export function isPlugin(value: unknown): value is Plugin<unknown> {
  return (
    value !== null &&
    typeof value === 'object' &&
    typeof (value as Plugin).name === 'string' &&
    typeof (value as Plugin).version === 'string' &&
    typeof (value as Plugin).install === 'function'
  );
}

/**
 * Type guard for Kernel.
 *
 * Checks if a value is a valid Kernel instance.
 *
 * @example
 * ```typescript
 * const kernel = {
 *   use: (plugin) => kernel,
 *   unregister: () => true,
 *   getPlugin: () => undefined,
 *   listPlugins: () => [],
 *   hasPlugin: () => false,
 *   emit: () => {},
 *   on: () => () => {},
 *   getContext: () => null
 * };
 * if (isKernel(kernel)) {
 *   console.log(kernel.listPlugins()); // TypeScript knows it's a Kernel
 * }
 * ```
 */
export function isKernel<T>(value: unknown): value is Kernel<T> {
  return (
    value !== null &&
    typeof value === 'object' &&
    typeof (value as Kernel<T>).use === 'function' &&
    typeof (value as Kernel<T>).unregister === 'function' &&
    typeof (value as Kernel<T>).getPlugin === 'function' &&
    typeof (value as Kernel<T>).listPlugins === 'function' &&
    typeof (value as Kernel<T>).hasPlugin === 'function' &&
    typeof (value as Kernel<T>).emit === 'function' &&
    typeof (value as Kernel<T>).on === 'function' &&
    typeof (value as Kernel<T>).getContext === 'function'
  );
}

/**
 * Type guard for OxogError.
 *
 * Checks if a value is an OxogError instance.
 *
 * @example
 * ```typescript
 * const error = new OxogError('Test', 'TEST');
 * if (isOxogError(error)) {
 *   console.log(error.code); // TypeScript knows it's an OxogError
 * }
 * ```
 */
export function isOxogError(value: unknown): value is OxogError {
  return value instanceof OxogError;
}

/**
 * Type guard for ValidationError.
 *
 * Checks if a value is a ValidationError instance.
 *
 * @example
 * ```typescript
 * const error = new ValidationError('Invalid', { field: 'test' });
 * if (isValidationError(error)) {
 *   console.log(error.context); // TypeScript knows it's a ValidationError
 * }
 * ```
 */
export function isValidationError(value: unknown): value is ValidationError {
  return value instanceof ValidationError;
}

/**
 * Type guard for PluginError.
 *
 * Checks if a value is a PluginError instance.
 *
 * @example
 * ```typescript
 * const error = new PluginError('Plugin failed', 'my-plugin');
 * if (isPluginError(error)) {
 *   console.log(error.pluginName); // TypeScript knows it's a PluginError
 * }
 * ```
 */
export function isPluginError(value: unknown): value is PluginError {
  return value instanceof PluginError;
}

/**
 * Type guard for Result.
 *
 * Checks if a value is a Result instance (either Ok or Err).
 *
 * @example
 * ```typescript
 * const result = Ok(42);
 * if (isResult(result)) {
 *   // result is Ok<number, unknown>
 * }
 *
 * const err = Err('error');
 * if (isResult(err)) {
 *   // err is Err<unknown, string>
 * }
 * ```
 */
export function isResult<T, E>(value: unknown): value is Result<T, E> {
  return (
    value !== null &&
    typeof value === 'object' &&
    typeof (value as Result<T, E>).ok === 'boolean' &&
    (('value' in (value as object)) || ('error' in (value as object)))
  );
}

/**
 * Type guard for Ok result.
 *
 * Checks if a Result is an Ok (success) instance.
 *
 * @example
 * ```typescript
 * const ok = Ok(42);
 * if (isOk(ok)) {
 *   console.log(ok.value); // TypeScript knows it's Ok
 * }
 * ```
 */
export function isOk<T>(value: Result<T, unknown>): value is Ok<T> {
  return isResult(value) && value.ok === true;
}

/**
 * Type guard for Err result.
 *
 * Checks if a Result is an Err (failure) instance.
 *
 * @example
 * ```typescript
 * const err = Err('error');
 * if (isErr(err)) {
 *   console.log(err.error); // TypeScript knows it's Err
 * }
 * ```
 */
export function isErr<E>(value: Result<unknown, E>): value is Err<E> {
  return isResult(value) && value.ok === false;
}
