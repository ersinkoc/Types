/**
 * @oxog/types - Common TypeScript utility types
 * @version 1.0.0
 * @author Ersin Koç
 */

/** Brand symbol for branded types */
declare const __brand: unique symbol;

/**
 * Creates a branded type for type-safe identifiers.
 *
 * Branded types allow you to create distinct types that share the same
 * underlying representation, preventing accidental type mixing.
 *
 * @example
 * ```typescript
 * type UserId = Branded<string, 'UserId'>;
 * type OrderId = Branded<string, 'OrderId'>;
 *
 * const userId: UserId = 'user_123' as UserId;
 * const orderId: OrderId = 'order_456' as OrderId;
 *
 * // Type error: Type 'UserId' is not assignable to type 'OrderId'
 * const wrong: OrderId = userId;
 * ```
 */
export type Branded<T, B extends string> = T & { readonly [__brand]: B };

/**
 * Shorthand for Branded.
 *
 * @example
 * ```typescript
 * type ProductId = Brand<number, 'ProductId'>;
 * ```
 */
export type Brand<T, B extends string> = Branded<T, B>;

/**
 * Deep partial - all nested properties optional.
 *
 * Recursively makes all properties and nested properties optional.
 *
 * @example
 * ```typescript
 * interface User {
 *   name: string;
 *   address: {
 *     street: string;
 *     city: string;
 *   };
 * }
 *
 * const partial: DeepPartial<User> = {
 *   name: 'John',
 *   address: {
 *     street: 'Main St'
 *     // city is optional
 *   }
 * };
 * ```
 */
export type DeepPartial<T> = T extends object
  ? { [P in keyof T]?: DeepPartial<T[P]> }
  : T;

/**
 * Deep readonly - all nested properties readonly.
 *
 * Recursively makes all properties and nested properties readonly.
 *
 * @example
 * ```typescript
 * interface Config {
 *   api: {
 *     url: string;
 *     timeout: number;
 *   };
 * }
 *
 * const readonlyConfig: DeepReadonly<Config> = {
 *   api: {
 *     url: 'https://api.example.com',
 *     timeout: 5000
 *   }
 * };
 *
 * // Type error: Cannot assign to 'url' because it is a read-only property
 * readonlyConfig.api.url = 'https://other.com';
 * ```
 */
export type DeepReadonly<T> = T extends object
  ? { readonly [P in keyof T]: DeepReadonly<T[P]> }
  : T;

/**
 * Deep required - all nested properties required.
 *
 * Recursively removes optional markers from all properties and nested properties.
 *
 * @example
 * ```typescript
 * interface OptionalUser {
 *   name?: string;
 *   address?: {
 *     street?: string;
 *     city?: string;
 *   };
 * }
 *
 * const required: DeepRequired<OptionalUser> = {
 *   name: 'John',
 *   address: {
 *     street: 'Main St',
 *     city: 'NYC'
 *   }
 * };
 * ```
 */
export type DeepRequired<T> = T extends object
  ? { [P in keyof T]-?: DeepRequired<T[P]> }
  : T;

/**
 * Value that may be a promise.
 *
 * Represents a value that can be either synchronous or asynchronous.
 *
 * @example
 * ```typescript
 * function process(data: string): MaybePromise<string> {
 *   if (useCache) {
 *     return cachedData; // Synchronous
 *   }
 *   return fetchData(); // Promise
 * }
 * ```
 */
export type MaybePromise<T> = T | Promise<T>;

/**
 * Any function type.
 *
 * Represents any callable function with any arguments and return type.
 */
export type AnyFunction = (...args: any[]) => any;

/**
 * Async function type.
 *
 * Represents an asynchronous function.
 *
 * @example
 * ```typescript
 * const fetchData: AsyncFunction<string> = async () => {
 *   return await fetch('/api/data').then(r => r.text());
 * };
 * ```
 */
export type AsyncFunction<T = unknown> = (...args: any[]) => Promise<T>;

/**
 * Sync function type.
 *
 * Represents a synchronous function.
 *
 * @example
 * ```typescript
 * const add: SyncFunction<number> = (a: number, b: number) => {
 *   return a + b;
 * };
 * ```
 */
export type SyncFunction<T = unknown> = (...args: any[]) => T;

/**
 * JSON primitive types.
 *
 * Represents valid JSON primitive values.
 */
export type JsonPrimitive = string | number | boolean | null;

/**
 * JSON array type.
 *
 * Represents a JSON array of JsonValue elements.
 */
export type JsonArray = JsonValue[];

/**
 * JSON object type.
 *
 * Represents a JSON object with string keys and JsonValue values.
 */
export type JsonObject = { [key: string]: JsonValue };

/**
 * Any valid JSON value.
 *
 * Represents any value that can be serialized to JSON.
 */
export type JsonValue = JsonPrimitive | JsonArray | JsonObject;

/**
 * Make type prettier in IDE.
 *
 * Utility type that flattens type structure for better IDE display.
 *
 * @example
 * ```typescript
 * type ComplexType = { a: string } & { b: number };
 * type PrettyType = Prettify<ComplexType>;
 * // IDE shows properties directly instead of intersection
 * ```
 */
export type Prettify<T> = { [K in keyof T]: T[K] } & {};

/**
 * Strict omit that requires valid keys.
 *
 * Like TypeScript's Omit, but ensures the keys exist in the type.
 *
 * @example
 * ```typescript
 * interface User {
 *   id: number;
 *   name: string;
 *   email: string;
 * }
 *
 * // Only 'id' and 'name' allowed - TypeScript will error on invalid keys
 * type UserWithoutEmail = StrictOmit<User, 'email'>;
 * ```
 */
export type StrictOmit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

/**
 * Strict pick that requires valid keys.
 *
 * Like TypeScript's Pick, but ensures the keys exist in the type.
 *
 * @example
 * ```typescript
 * interface User {
 *   id: number;
 *   name: string;
 *   email: string;
 * }
 *
 * // Only 'id' and 'name' allowed - TypeScript will error on invalid keys
 * type UserBasicInfo = StrictPick<User, 'id' | 'name'>;
 * ```
 */
export type StrictPick<T, K extends keyof T> = Pick<T, K>;

/**
 * Array with at least one element.
 *
 * Represents arrays that are guaranteed to have at least one element.
 *
 * @example
 * ```typescript
 * const nonEmpty: NonEmptyArray<number> = [1];
 * const nonEmpty2: NonEmptyArray<string> = ['hello', 'world'];
 *
 * // Type error: Argument of type 'number[]' is not assignable
 * const empty: NonEmptyArray<number> = [];
 * ```
 */
export type NonEmptyArray<T> = [T, ...T[]];

/**
 * Value that can be null.
 *
 * Alias for nullable types.
 *
 * @example
 * ```typescript
 * const value: Nullable<string> = null;
 * const value2: Nullable<number> = 42;
 * ```
 */
export type Nullable<T> = T | null;

/**
 * Value that can be undefined.
 *
 * Alias for optional types.
 *
 * @example
 * ```typescript
 * const value: Optional<string> = undefined;
 * const value2: Optional<number> = 123;
 * ```
 */
export type Optional<T> = T | undefined;

/**
 * Unsubscribe function returned by event subscriptions.
 *
 * Call this function to unsubscribe from an event.
 *
 * @example
 * ```typescript
 * const unsubscribe = eventEmitter.on('event', handler);
 * // Later, when done listening:
 * unsubscribe();
 * ```
 */
export type Unsubscribe = () => void;
