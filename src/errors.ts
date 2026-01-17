/**
 * @oxog/types - Standardized error classes
 * @version 1.0.2
 * @author Ersin Koç
 */

/**
 * Standard error codes for @oxog ecosystem.
 *
 * These codes provide programmatic ways to identify and handle errors.
 */
export enum ErrorCodes {
  /** Unknown error */
  UNKNOWN = 'UNKNOWN',

  /** Validation error */
  VALIDATION_ERROR = 'VALIDATION_ERROR',

  /** Plugin-related error */
  PLUGIN_ERROR = 'PLUGIN_ERROR',

  /** Resource not found */
  NOT_FOUND = 'NOT_FOUND',

  /** Operation timed out */
  TIMEOUT = 'TIMEOUT',

  /** Dependency error */
  DEPENDENCY_ERROR = 'DEPENDENCY_ERROR',
}

/**
 * Base error class for all @oxog errors.
 *
 * Provides structured error information with code, message, and context.
 * All other @oxog errors inherit from this class.
 *
 * @example
 * ```typescript
 * throw new OxogError(
 *   'Database connection failed',
 *   ErrorCodes.DEPENDENCY_ERROR,
 *   { host: 'localhost', port: 5432 }
 * );
 * ```
 */
export class OxogError extends Error {
  /** Error name */
  public override readonly name: string;

  /**
   * Creates a new OxogError.
   *
   * @param message - Human-readable error message
   * @param code - Error code for programmatic handling
   * @param context - Additional context about the error
   */
  constructor(
    message: string,
    public readonly code: string,
    public readonly context?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'OxogError';
    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this, new.target);
  }
}

/**
 * Error thrown when validation fails.
 *
 * Used for input validation, schema validation, and type checking errors.
 *
 * @example
 * ```typescript
 * throw new ValidationError(
 *   'Invalid email format',
 *   { field: 'email', value: 'not-an-email' }
 * );
 * ```
 */
export class ValidationError extends OxogError {
  /** Error name */
  public override readonly name: string;

  /**
   * Creates a new ValidationError.
   *
   * @param message - Human-readable error message
   * @param context - Additional context about the validation failure
   */
  constructor(
    message: string,
    public override readonly context?: Record<string, unknown>
  ) {
    super(message, ErrorCodes.VALIDATION_ERROR, context);
    this.name = 'ValidationError';
    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this, new.target);
  }
}

/**
 * Error thrown when a plugin operation fails.
 *
 * Used for plugin initialization, dependency resolution, and runtime errors
 * specific to plugins.
 *
 * @example
 * ```typescript
 * throw new PluginError(
 *   'Failed to initialize cache plugin',
 *   'cache-plugin',
 *   { reason: 'Redis connection failed' }
 * );
 * ```
 */
export class PluginError extends OxogError {
  /** Error name */
  public override readonly name: string;

  /**
   * Creates a new PluginError.
   *
   * @param message - Human-readable error message
   * @param pluginName - Name of the plugin that caused the error
   * @param context - Additional context about the plugin error
   */
  constructor(
    message: string,
    public readonly pluginName: string,
    context?: Record<string, unknown>
  ) {
    super(message, ErrorCodes.PLUGIN_ERROR, { pluginName, ...context });
    this.name = 'PluginError';
    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this, new.target);
  }
}
