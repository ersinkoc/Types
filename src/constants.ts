/**
 * @oxog/types - Well-known symbols and constants
 * @version 1.0.0
 * @author Ersin Koç
 */

import { ErrorCodes } from './errors.js';

/**
 * Well-known symbol for @oxog plugins.
 *
 * Use this symbol to mark objects as @oxog plugins.
 * This enables runtime detection and validation.
 *
 * @example
 * ```typescript
 * const myPlugin = {
 *   [OXOG_PLUGIN]: true,
 *   name: 'my-plugin',
 *   version: '1.0.0',
 *   install: () => {}
 * };
 * ```
 */
export const OXOG_PLUGIN = Symbol.for('@oxog/plugin');

/**
 * Well-known symbol for @oxog kernels.
 *
 * Use this symbol to mark objects as @oxog kernels.
 * This enables runtime detection and validation.
 *
 * @example
 * ```typescript
 * const myKernel = {
 *   [OXOG_KERNEL]: true,
 *   use: (plugin) => kernel,
 *   // ... other methods
 * };
 * ```
 */
export const OXOG_KERNEL = Symbol.for('@oxog/kernel');

/**
 * @oxog/types package version.
 *
 * Current version of the @oxog/types package.
 *
 * @example
 * ```typescript
 * console.log(`Using @oxog/types v${OXOG_VERSION}`);
 * ```
 */
export const OXOG_VERSION = '1.0.0';

/**
 * Standard error codes for @oxog ecosystem.
 *
 * Re-exported from errors module for convenience.
 *
 * @example
 * ```typescript
 * throw new OxogError('Not found', ErrorCodes.NOT_FOUND);
 * ```
 */
export { ErrorCodes };
