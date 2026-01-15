import { describe, it, expect } from 'vitest';
import { OxogError, ValidationError, PluginError, ErrorCodes } from '../../src/errors.js';

describe('ErrorCodes', () => {
  it('should have all error codes', () => {
    expect(ErrorCodes.UNKNOWN).toBe('UNKNOWN');
    expect(ErrorCodes.VALIDATION_ERROR).toBe('VALIDATION_ERROR');
    expect(ErrorCodes.PLUGIN_ERROR).toBe('PLUGIN_ERROR');
    expect(ErrorCodes.NOT_FOUND).toBe('NOT_FOUND');
    expect(ErrorCodes.TIMEOUT).toBe('TIMEOUT');
    expect(ErrorCodes.DEPENDENCY_ERROR).toBe('DEPENDENCY_ERROR');
  });

  it('should be an enum', () => {
    expect(Object.keys(ErrorCodes)).toEqual([
      'UNKNOWN',
      'VALIDATION_ERROR',
      'PLUGIN_ERROR',
      'NOT_FOUND',
      'TIMEOUT',
      'DEPENDENCY_ERROR',
    ]);
  });
});

describe('OxogError', () => {
  it('should create error with message only', () => {
    const error = new OxogError('Something went wrong', ErrorCodes.UNKNOWN);

    expect(error.message).toBe('Something went wrong');
    expect(error.code).toBe(ErrorCodes.UNKNOWN);
    expect(error.name).toBe('OxogError');
    expect(error.context).toBeUndefined();
  });

  it('should create error with message and code', () => {
    const error = new OxogError('Database error', ErrorCodes.DEPENDENCY_ERROR);

    expect(error.message).toBe('Database error');
    expect(error.code).toBe(ErrorCodes.DEPENDENCY_ERROR);
    expect(error.name).toBe('OxogError');
  });

  it('should create error with message, code, and context', () => {
    const context = { host: 'localhost', port: 5432 };
    const error = new OxogError(
      'Connection failed',
      ErrorCodes.DEPENDENCY_ERROR,
      context
    );

    expect(error.message).toBe('Connection failed');
    expect(error.code).toBe(ErrorCodes.DEPENDENCY_ERROR);
    expect(error.context).toEqual(context);
  });

  it('should create error with complex context', () => {
    const context = {
      userId: '123',
      timestamp: Date.now(),
      metadata: { action: 'login' },
    };

    const error = new OxogError('Unauthorized', ErrorCodes.DEPENDENCY_ERROR, context);

    expect(error.context).toEqual(context);
  });

  it('should have proper prototype chain', () => {
    const error = new OxogError('Test', ErrorCodes.UNKNOWN);

    expect(error instanceof Error).toBe(true);
    expect(error instanceof OxogError).toBe(true);
  });

  it('should capture stack trace', () => {
    const error = new OxogError('Test error', ErrorCodes.UNKNOWN);

    expect(error.stack).toBeDefined();
    expect(error.stack).toContain('OxogError');
    expect(error.stack).toContain('Test error');
  });

  it('should serialize to string', () => {
    const error = new OxogError('Test message', ErrorCodes.TEST);

    expect(error.toString()).toBe('OxogError: Test message');
  });
});

describe('ValidationError', () => {
  it('should create error with message only', () => {
    const error = new ValidationError('Invalid input');

    expect(error.message).toBe('Invalid input');
    expect(error.code).toBe(ErrorCodes.VALIDATION_ERROR);
    expect(error.name).toBe('ValidationError');
    expect(error.context).toBeUndefined();
  });

  it('should create error with message and context', () => {
    const context = { field: 'email', value: 'invalid-email' };
    const error = new ValidationError('Invalid email format', context);

    expect(error.message).toBe('Invalid email format');
    expect(error.code).toBe(ErrorCodes.VALIDATION_ERROR);
    expect(error.context).toEqual(context);
  });

  it('should have proper prototype chain', () => {
    const error = new ValidationError('Test');

    expect(error instanceof Error).toBe(true);
    expect(error instanceof OxogError).toBe(true);
    expect(error instanceof ValidationError).toBe(true);
  });

  it('should capture stack trace', () => {
    const error = new ValidationError('Validation failed');

    expect(error.stack).toBeDefined();
    expect(error.stack).toContain('ValidationError');
  });
});

describe('PluginError', () => {
  it('should create error with message and plugin name', () => {
    const error = new PluginError('Failed to initialize', 'cache-plugin');

    expect(error.message).toBe('Failed to initialize');
    expect(error.pluginName).toBe('cache-plugin');
    expect(error.code).toBe(ErrorCodes.PLUGIN_ERROR);
    expect(error.name).toBe('PluginError');
    expect(error.context).toBeUndefined();
  });

  it('should create error with message, plugin name, and context', () => {
    const context = { reason: 'Redis connection failed' };
    const error = new PluginError('Cache initialization failed', 'cache-plugin', context);

    expect(error.message).toBe('Cache initialization failed');
    expect(error.pluginName).toBe('cache-plugin');
    expect(error.context).toEqual({ pluginName: 'cache-plugin', reason: 'Redis connection failed' });
  });

  it('should merge context with plugin name', () => {
    const error = new PluginError('Error', 'test-plugin', { extra: 'data' });

    expect(error.context).toEqual({
      pluginName: 'test-plugin',
      extra: 'data',
    });
  });

  it('should have proper prototype chain', () => {
    const error = new PluginError('Test', 'plugin');

    expect(error instanceof Error).toBe(true);
    expect(error instanceof OxogError).toBe(true);
    expect(error instanceof PluginError).toBe(true);
  });

  it('should capture stack trace', () => {
    const error = new PluginError('Plugin failed', 'test-plugin');

    expect(error.stack).toBeDefined();
    expect(error.stack).toContain('PluginError');
  });
});

describe('Error Hierarchy', () => {
  it('should allow catching as base Error', () => {
    const error = new OxogError('Test', ErrorCodes.UNKNOWN);

    try {
      throw error;
    } catch (e) {
      expect(e instanceof Error).toBe(true);
      expect((e as Error).message).toBe('Test');
    }
  });

  it('should allow catching as OxogError', () => {
    const error = new OxogError('Test', ErrorCodes.UNKNOWN);

    try {
      throw error;
    } catch (e) {
      expect(e instanceof OxogError).toBe(true);
      expect((e as OxogError).code).toBe(ErrorCodes.UNKNOWN);
    }
  });

  it('should allow catching ValidationError as OxogError', () => {
    const error = new ValidationError('Invalid');

    try {
      throw error;
    } catch (e) {
      expect(e instanceof OxogError).toBe(true);
      expect(e.code).toBe(ErrorCodes.VALIDATION_ERROR);
    }
  });

  it('should allow catching PluginError as OxogError', () => {
    const error = new PluginError('Plugin failed', 'test');

    try {
      throw error;
    } catch (e) {
      expect(e instanceof OxogError).toBe(true);
      expect(e.code).toBe(ErrorCodes.PLUGIN_ERROR);
    }
  });

  it('should allow specific error handling', () => {
    function handleError(error: unknown) {
      if (error instanceof ValidationError) {
        return 'Validation error';
      }
      if (error instanceof PluginError) {
        return 'Plugin error';
      }
      if (error instanceof OxogError) {
        return 'Oxog error';
      }
      return 'Unknown error';
    }

    expect(handleError(new ValidationError('Invalid'))).toBe('Validation error');
    expect(handleError(new PluginError('Failed', 'test'))).toBe('Plugin error');
    expect(handleError(new OxogError('Test', ErrorCodes.UNKNOWN))).toBe('Oxog error');
    expect(handleError(new Error('Generic'))).toBe('Unknown error');
  });
});

describe('Error Context', () => {
  it('should preserve context object', () => {
    const context = { userId: '123', action: 'login' };
    const error = new OxogError('Unauthorized', ErrorCodes.DEPENDENCY_ERROR, context);

    expect(error.context).toBe(context);
  });

  it('should allow context mutation', () => {
    const context: Record<string, unknown> = { count: 0 };
    const error = new OxogError('Test', ErrorCodes.UNKNOWN, context);

    context.count = 1;

    expect(error.context?.count).toBe(1);
  });

  it('should handle undefined context', () => {
    const error = new OxogError('Test', ErrorCodes.UNKNOWN);

    expect(error.context).toBeUndefined();
  });
});
