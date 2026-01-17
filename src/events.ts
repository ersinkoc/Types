/**
 * @oxog/types - Event system types
 * @version 1.0.2
 * @author Ersin Koç
 */

import type { Unsubscribe } from './utils.js';

/**
 * Base event map interface.
 *
 * Defines the structure for event payloads. Extend this interface
 * to define custom events for your application.
 *
 * @example
 * ```typescript
 * interface MyEvents extends EventMap {
 *   'user:login': { userId: string; timestamp: number };
 *   'user:logout': { userId: string };
 *   'error': Error;
 * }
 * ```
 */
export interface EventMap {
  [event: string]: unknown;
}

/**
 * Event handler for a specific event.
 *
 * Type-safe event handler that receives the correctly typed payload.
 *
 * @example
 * ```typescript
 * interface MyEvents extends EventMap {
 *   'user:login': { userId: string; timestamp: number };
 * }
 *
 * const handler: EventHandler<MyEvents, 'user:login'> = (payload) => {
 *   console.log(payload.userId, payload.timestamp);
 * };
 * ```
 */
export type EventHandler<
  TEvents extends EventMap,
  K extends keyof TEvents
> = (payload: TEvents[K]) => void;

/**
 * Typed event emitter interface.
 *
 * Provides type-safe event emission and subscription. Implement this
 * interface to create custom event emitters.
 *
 * @example
 * ```typescript
 * class MyEmitter implements TypedEventEmitter<MyEvents> {
 *   private handlers = new Map<string, Set<Function>>();
 *
 *   on<K extends keyof MyEvents>(event: K, handler: EventHandler<MyEvents, K>): Unsubscribe {
 *     // Implementation
 *     return () => {};
 *   }
 *
 *   off<K extends keyof MyEvents>(event: K, handler: EventHandler<MyEvents, K>): void {
 *     // Implementation
 *   }
 *
 *   emit<K extends keyof MyEvents>(event: K, payload: MyEvents[K]): void {
 *     // Implementation
 *   }
 *
 *   once<K extends keyof MyEvents>(event: K, handler: EventHandler<MyEvents, K>): Unsubscribe {
 *     // Implementation
 *     return () => {};
 *   }
 * }
 * ```
 */
export interface TypedEventEmitter<TEvents extends EventMap> {
  /** Subscribe to an event */
  on<K extends keyof TEvents>(event: K, handler: EventHandler<TEvents, K>): Unsubscribe;

  /** Unsubscribe from an event */
  off<K extends keyof TEvents>(event: K, handler: EventHandler<TEvents, K>): void;

  /** Emit an event */
  emit<K extends keyof TEvents>(event: K, payload: TEvents[K]): void;

  /** Subscribe to an event exactly once */
  once<K extends keyof TEvents>(event: K, handler: EventHandler<TEvents, K>): Unsubscribe;
}
