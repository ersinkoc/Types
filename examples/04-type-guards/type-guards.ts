/**
 * Example 04: Type Guards
 *
 * This example demonstrates runtime type checking with type guards.
 */

import {
  isPlugin,
  isKernel,
  isOxogError,
  isValidationError,
  isPluginError,
  isResult,
  isOk,
  isErr,
} from '@oxog/types';
import { Ok, Err } from '@oxog/types';
import { OxogError, ValidationError, PluginError } from '@oxog/types';

console.log('=== Example 04: Type Guards ===\n');

// Example 1: Validating Plugin structure
const validPlugin = {
  name: 'my-plugin',
  version: '1.0.0',
  install: () => {},
};

const invalidPlugin = {
  name: 'my-plugin',
  version: '1.0.0',
  // missing install
};

console.log('Plugin validation:');
console.log('  validPlugin:', isPlugin(validPlugin) ? '✓ Valid' : '✗ Invalid');
console.log('  invalidPlugin:', isPlugin(invalidPlugin) ? '✓ Valid' : '✗ Invalid');

// Example 2: Validating Kernel structure
const validKernel = {
  use: () => {},
  unregister: () => true,
  getPlugin: () => undefined,
  listPlugins: () => [],
  hasPlugin: () => false,
  emit: () => {},
  on: () => () => {},
  getContext: () => {},
};

const invalidKernel = {
  use: () => {},
  // missing other methods
};

console.log('\nKernel validation:');
console.log('  validKernel:', isKernel(validKernel) ? '✓ Valid' : '✗ Invalid');
console.log('  invalidKernel:', isKernel(invalidKernel) ? '✓ Valid' : '✗ Invalid');

// Example 3: Checking error types
const oxogError = new OxogError('Test', 'TEST');
const validationError = new ValidationError('Invalid', { field: 'test' });
const pluginError = new PluginError('Failed', 'test-plugin');

console.log('\nError type checking:');
console.log('  oxogError:', isOxogError(oxogError) ? '✓ Is OxogError' : '✗ Not OxogError');
console.log('  validationError:', isValidationError(validationError) ? '✓ Is ValidationError' : '✗ Not ValidationError');
console.log('  pluginError:', isPluginError(pluginError) ? '✓ Is PluginError' : '✗ Not PluginError');

// Example 4: Error hierarchy checking
const errors: unknown[] = [
  oxogError,
  validationError,
  pluginError,
  new Error('Generic'),
];

console.log('\nError hierarchy:');
errors.forEach((error, index) => {
  console.log(`  Error ${index + 1}:`);
  console.log('    isOxogError:', isOxogError(error));
  console.log('    isValidationError:', isValidationError(error));
  console.log('    isPluginError:', isPluginError(error));
});

// Example 5: Result type checking
const ok = Ok(42);
const err = Err('error');

console.log('\nResult type checking:');
console.log('  ok:', isResult(ok) ? '✓ Is Result' : '✗ Not Result');
console.log('  ok:', isOk(ok) ? '✓ Is Ok' : '✗ Not Ok');
console.log('  ok:', isErr(ok) ? '✓ Is Err' : '✗ Not Err');
console.log('  err:', isResult(err) ? '✓ Is Result' : '✗ Not Result');
console.log('  err:', isOk(err) ? '✓ Is Ok' : '✗ Not Ok');
console.log('  err:', isErr(err) ? '✓ Is Err' : '✗ Not Err');

// Example 6: Type narrowing in functions
function processResult(value: unknown): string {
  if (isOk(value)) {
    return `Success: ${value.value}`;
  }

  if (isErr(value)) {
    return `Error: ${value.error}`;
  }

  return 'Unknown type';
}

console.log('\nFunction with type narrowing:');
console.log('  processResult(ok):', processResult(ok));
console.log('  processResult(err):', processResult(err));
console.log('  processResult(null):', processResult(null));

// Example 7: Practical plugin validation
function registerPlugin(plugin: unknown): string {
  if (!isPlugin(plugin)) {
    return 'Invalid plugin structure';
  }

  return `Plugin '${plugin.name}' v${plugin.version} registered successfully`;
}

console.log('\nPlugin registration:');
console.log('  registerPlugin(valid):', registerPlugin(validPlugin));
console.log('  registerPlugin(invalid):', registerPlugin(invalidPlugin));
console.log('  registerPlugin(null):', registerPlugin(null));

// Example 8: Error handling with type guards
function handleError(error: unknown): void {
  console.log('\nError handling with guards:');

  if (isValidationError(error)) {
    console.log(`  Validation error in field '${error.context?.field}'`);
    console.log(`  Message: ${error.message}`);
    return;
  }

  if (isPluginError(error)) {
    console.log(`  Plugin error in '${error.pluginName}'`);
    console.log(`  Message: ${error.message}`);
    return;
  }

  if (isOxogError(error)) {
    console.log(`  Oxog error [${error.code}]`);
    console.log(`  Message: ${error.message}`);
    return;
  }

  console.log('  Unknown error type');
}

handleError(validationError);
handleError(pluginError);
handleError(oxogError);
handleError(new Error('Generic'));

// Example 9: Combining type guards
function analyzeValue(value: unknown): void {
  console.log('\nAnalyzing value:');

  if (isResult(value)) {
    if (isOk(value)) {
      console.log(`  Type: Result<Ok>`);
      console.log(`  Value: ${value.value}`);
    } else if (isErr(value)) {
      console.log(`  Type: Result<Err>`);
      console.log(`  Error: ${value.error}`);
    }
  } else if (isOxogError(value)) {
    console.log(`  Type: OxogError`);
    console.log(`  Code: ${value.code}`);
  } else {
    console.log(`  Type: ${typeof value}`);
  }
}

analyzeValue(Ok('hello'));
analyzeValue(Err('failed'));
analyzeValue(new OxogError('Test', 'TEST'));
analyzeValue(123);
analyzeValue('string');

// Example 10: Safe type assertion with guards
function safeGetPluginValue(plugin: unknown): string {
  if (isPlugin(plugin)) {
    // TypeScript knows plugin is Plugin here
    return `${plugin.name}@${plugin.version}`;
  }

  // TypeScript knows plugin is not Plugin here
  return 'Invalid plugin';
}

console.log('\nSafe type assertion:');
console.log('  Valid plugin:', safeGetPluginValue(validPlugin));
console.log('  Invalid plugin:', safeGetPluginValue(invalidPlugin));

console.log('\n=== End Example 04 ===\n');
