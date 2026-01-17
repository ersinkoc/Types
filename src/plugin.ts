/**
 * @oxog/types - Plugin and Kernel interfaces
 * @version 1.0.2
 * @author Ersin Koç
 */

import type { MaybePromise, Unsubscribe } from './utils.js';

/**
 * Standard plugin interface for @oxog ecosystem.
 *
 * A plugin is a self-contained module that can be registered with a Kernel.
 * Plugins can depend on other plugins and communicate through the Kernel's
 * event system.
 *
 * @example
 * ```typescript
 * const myPlugin: Plugin = {
 *   name: 'my-plugin',
 *   version: '1.0.0',
 *   dependencies: ['logger'],
 *   install(kernel) {
 *     kernel.on('init', () => console.log('Plugin installed'));
 *   },
 *   onInit(context) {
 *     // Called after all plugins installed
 *   },
 *   onDestroy() {
 *     // Cleanup resources
 *   },
 *   onError(error) {
 *     console.error('Plugin error:', error);
 *   }
 * };
 * ```
 */
export interface Plugin<TContext = unknown> {
  /** Unique plugin identifier (kebab-case) */
  readonly name: string;

  /** Semantic version (e.g., "1.0.0") */
  readonly version: string;

  /** Plugin dependencies by name */
  readonly dependencies?: readonly string[];

  /** Called when plugin is registered with the kernel */
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
 *
 * The Kernel manages plugins and provides event communication between them.
 * It maintains a plugin registry and exposes methods for plugin lifecycle
 * management.
 *
 * @example
 * ```typescript
 * // Register a plugin
 * kernel.use(myPlugin);
 *
 * // Get a plugin
 * const plugin = kernel.getPlugin('logger');
 *
 * // Check if plugin exists
 * if (kernel.hasPlugin('logger')) {
 *   // Plugin is registered
 * }
 *
 * // Emit event
 * kernel.emit('user:login', { userId: '123' });
 *
 * // Subscribe to events
 * const unsubscribe = kernel.on('user:login', (payload) => {
 *   console.log('User logged in:', payload);
 * });
 * ```
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
 *
 * Configuration options that can be passed when creating or configuring
 * a plugin-enabled application.
 *
 * @example
 * ```typescript
 * const options: PluginOptions = {
 *   debug: true,
 *   logger: console
 * };
 * ```
 */
export interface PluginOptions {
  /** Whether to enable debug mode */
  debug?: boolean;

  /** Custom logger */
  logger?: PluginLogger;
}

/**
 * Plugin logger interface.
 *
 * Standard logging interface that plugins can use to log messages.
 * This abstraction allows custom logging implementations.
 *
 * @example
 * ```typescript
 * const logger: PluginLogger = {
 *   debug(message, ...args) { console.log('[DEBUG]', message, ...args); },
 *   info(message, ...args) { console.log('[INFO]', message, ...args); },
 *   warn(message, ...args) { console.warn('[WARN]', message, ...args); },
 *   error(message, ...args) { console.error('[ERROR]', message, ...args); }
 * };
 * ```
 */
export interface PluginLogger {
  debug(message: string, ...args: unknown[]): void;
  info(message: string, ...args: unknown[]): void;
  warn(message: string, ...args: unknown[]): void;
  error(message: string, ...args: unknown[]): void;
}
