/**
 * @oxog/types - Shared TypeScript types for the @oxog ecosystem
 * @version 1.0.3
 * @author Ersin Koç
 *
 * This is the foundational package for the @oxog ecosystem, providing
 * core type definitions for micro-kernel plugin architecture, functional
 * error handling with Result type, standardized error classes, type guards,
 * utility types, and event system primitives.
 *
 * Zero runtime dependencies. Pure TypeScript.
 *
 * @example
 * ```typescript
 * import { Plugin, Kernel, Result, Ok, Err, OxogError } from '@oxog/types';
 * ```
 */

// Re-export plugin and kernel interfaces
export * from './plugin.js';

// Re-export Result type and helpers
export * from './result.js';

// Re-export error classes
export * from './errors.js';

// Re-export type guards
export * from './guards.js';

// Re-export event types
export * from './events.js';

// Re-export utility types
export * from './utils.js';

// Re-export constants and symbols
export * from './constants.js';
