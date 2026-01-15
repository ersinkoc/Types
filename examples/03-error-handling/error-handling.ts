/**
 * Example 03: Error Handling
 *
 * This example demonstrates the standardized error classes in @oxog/types.
 */

import { OxogError, ValidationError, PluginError, ErrorCodes } from '@oxog/types';

console.log('=== Example 03: Error Handling ===\n');

// Example 1: Using OxogError with error codes
try {
  throw new OxogError(
    'Database connection failed',
    ErrorCodes.DEPENDENCY_ERROR,
    { host: 'localhost', port: 5432 }
  );
} catch (error) {
  if (error instanceof OxogError) {
    console.log('OxogError caught:');
    console.log('  Message:', error.message);
    console.log('  Code:', error.code);
    console.log('  Context:', error.context);
  }
}

// Example 2: Using ValidationError
function validateUser(user: { name: string; email: string; age: number }) {
  if (!user.name) {
    throw new ValidationError('Name is required', { field: 'name' });
  }

  if (!user.email || !user.email.includes('@')) {
    throw new ValidationError('Invalid email format', {
      field: 'email',
      value: user.email,
    });
  }

  if (user.age < 0 || user.age > 150) {
    throw new ValidationError('Invalid age', {
      field: 'age',
      value: user.age,
    });
  }

  return true;
}

console.log('\nValidating users:');

// Valid user
try {
  validateUser({ name: 'John', email: 'john@example.com', age: 30 });
  console.log('✓ Valid user');
} catch (error) {
  console.log('✗ Error:', error);
}

// Invalid email
try {
  validateUser({ name: 'Jane', email: 'invalid-email', age: 25 });
  console.log('✓ Valid user');
} catch (error) {
  if (error instanceof ValidationError) {
    console.log('✗ Validation failed:', error.message);
    console.log('  Field:', error.context?.field);
    console.log('  Value:', error.context?.value);
  }
}

// Missing name
try {
  validateUser({ name: '', email: 'test@example.com', age: 30 });
  console.log('✓ Valid user');
} catch (error) {
  if (error instanceof ValidationError) {
    console.log('✗ Validation failed:', error.message);
  }
}

// Example 3: Using PluginError
function initializePlugin(pluginName: string, config: unknown) {
  if (!config) {
    throw new PluginError('Configuration is required', pluginName, {
      config: null,
    });
  }

  if (typeof config !== 'object' || !('apiKey' in config)) {
    throw new PluginError('Invalid configuration format', pluginName, {
      expected: { apiKey: 'string' },
      received: config,
    });
  }

  console.log(`✓ Plugin '${pluginName}' initialized successfully`);
  return true;
}

console.log('\nInitializing plugins:');

// Valid plugin initialization
try {
  initializePlugin('auth-plugin', { apiKey: 'secret123' });
} catch (error) {
  console.log('✗ Error:', error);
}

// Missing config
try {
  initializePlugin('cache-plugin', null);
} catch (error) {
  if (error instanceof PluginError) {
    console.log('✗ Plugin initialization failed:', error.message);
    console.log('  Plugin:', error.pluginName);
    console.log('  Reason:', error.context?.reason);
  }
}

// Invalid config
try {
  initializePlugin('logger-plugin', { timeout: 5000 });
} catch (error) {
  if (error instanceof PluginError) {
    console.log('✗ Plugin initialization failed:', error.message);
    console.log('  Expected:', error.context?.expected);
  }
}

// Example 4: Error hierarchy
function handleError(error: unknown): string {
  if (error instanceof ValidationError) {
    return `[VALIDATION] ${error.message}`;
  }

  if (error instanceof PluginError) {
    return `[PLUGIN ${error.pluginName}] ${error.message}`;
  }

  if (error instanceof OxogError) {
    return `[OXOG ${error.code}] ${error.message}`;
  }

  return `[UNKNOWN] ${error instanceof Error ? error.message : 'Unknown error'}`;
}

console.log('\nError handling:');

const errors = [
  new ValidationError('Invalid input', { field: 'test' }),
  new PluginError('Init failed', 'test-plugin'),
  new OxogError('Something went wrong', ErrorCodes.UNKNOWN),
  new Error('Generic error'),
];

errors.forEach((error) => {
  console.log(handleError(error));
});

// Example 5: Using error codes
console.log('\nAvailable error codes:');
console.log('  UNKNOWN:', ErrorCodes.UNKNOWN);
console.log('  VALIDATION_ERROR:', ErrorCodes.VALIDATION_ERROR);
console.log('  PLUGIN_ERROR:', ErrorCodes.PLUGIN_ERROR);
console.log('  NOT_FOUND:', ErrorCodes.NOT_FOUND);
console.log('  TIMEOUT:', ErrorCodes.TIMEOUT);
console.log('  DEPENDENCY_ERROR:', ErrorCodes.DEPENDENCY_ERROR);

// Example 6: Error with rich context
try {
  throw new OxogError(
    'Payment processing failed',
    ErrorCodes.DEPENDENCY_ERROR,
    {
      userId: 'user_123',
      transactionId: 'tx_456',
      amount: 99.99,
      currency: 'USD',
      timestamp: new Date().toISOString(),
    }
  );
} catch (error) {
  if (error instanceof OxogError) {
    console.log('\nRich error context:');
    Object.entries(error.context || {}).forEach(([key, value]) => {
      console.log(`  ${key}:`, value);
    });
  }
}

// Example 7: Catching different error types
console.log('\nCatching errors by type:');

try {
  // This will throw a ValidationError
  validateUser({ name: '', email: 'test@example.com', age: 30 });
} catch (error) {
  if (error instanceof ValidationError) {
    console.log('✓ Caught ValidationError');
  } else if (error instanceof PluginError) {
    console.log('Caught PluginError');
  } else if (error instanceof OxogError) {
    console.log('Caught OxogError');
  } else {
    console.log('Caught unknown error');
  }
}

console.log('\n=== End Example 03 ===\n');
