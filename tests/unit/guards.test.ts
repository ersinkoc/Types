import { describe, it, expect } from 'vitest';
import { isPlugin, isKernel, isOxogError, isValidationError, isPluginError, isResult, isOk, isErr } from '../../src/guards.js';
import { OxogError, ValidationError, PluginError, ErrorCodes } from '../../src/errors.js';
import { Ok, Err } from '../../src/result.js';

describe('isPlugin', () => {
  it('should return true for valid plugin', () => {
    const plugin = {
      name: 'test-plugin',
      version: '1.0.0',
      install: () => {},
    };

    expect(isPlugin(plugin)).toBe(true);
  });

  it('should return true for plugin with all properties', () => {
    const plugin = {
      name: 'test-plugin',
      version: '1.0.0',
      dependencies: ['logger'],
      install: () => {},
      onInit: () => {},
      onDestroy: () => {},
      onError: () => {},
    };

    expect(isPlugin(plugin)).toBe(true);
  });

  it('should return false for null', () => {
    expect(isPlugin(null)).toBe(false);
  });

  it('should return false for undefined', () => {
    expect(isPlugin(undefined)).toBe(false);
  });

  it('should return false for primitive', () => {
    expect(isPlugin('string')).toBe(false);
    expect(isPlugin(123)).toBe(false);
    expect(isPlugin(true)).toBe(false);
  });

  it('should return false for object without required properties', () => {
    expect(isPlugin({})).toBe(false);
    expect(isPlugin({ name: 'test' })).toBe(false);
    expect(isPlugin({ name: 'test', version: '1.0.0' })).toBe(false);
    expect(isPlugin({ name: 'test', install: () => {} })).toBe(false);
  });

  it('should return false for object with wrong types', () => {
    expect(isPlugin({ name: 123, version: '1.0.0', install: () => {} })).toBe(false);
    expect(isPlugin({ name: 'test', version: 123, install: () => {} })).toBe(false);
    expect(isPlugin({ name: 'test', version: '1.0.0', install: 'not a function' })).toBe(false);
  });

  it('should return true for typed plugin', () => {
    interface MyContext {
      config: Record<string, unknown>;
    }

    const plugin = {
      name: 'test',
      version: '1.0.0',
      install: () => {},
    };

    expect(isPlugin<MyContext>(plugin)).toBe(true);
  });
});

describe('isKernel', () => {
  it('should return true for valid kernel', () => {
    const kernel = {
      use: (plugin) => kernel,
      unregister: () => true,
      getPlugin: () => undefined,
      listPlugins: () => [],
      hasPlugin: () => false,
      emit: () => {},
      on: () => () => {},
      getContext: () => null,
    };

    expect(isKernel(kernel)).toBe(true);
  });

  it('should return false for null', () => {
    expect(isKernel(null)).toBe(false);
  });

  it('should return false for undefined', () => {
    expect(isKernel(undefined)).toBe(false);
  });

  it('should return false for object without required methods', () => {
    expect(isKernel({})).toBe(false);
    expect(isKernel({ use: () => {} })).toBe(false);
    expect(isKernel({ use: () => {}, unregister: () => true })).toBe(false);
  });

  it('should return false for object with wrong method types', () => {
    expect(isKernel({ use: 'not a function' })).toBe(false);
    expect(isKernel({ use: () => {}, unregister: 'not a function' })).toBe(false);
  });

  it('should return true for typed kernel', () => {
    interface MyContext {
      config: Record<string, unknown>;
    }

    const kernel = {
      use: (plugin) => kernel,
      unregister: () => true,
      getPlugin: () => undefined,
      listPlugins: () => [],
      hasPlugin: () => false,
      emit: () => {},
      on: () => () => {},
      getContext: () => ({ config: {} }),
    };

    expect(isKernel<MyContext>(kernel)).toBe(true);
  });
});

describe('isOxogError', () => {
  it('should return true for OxogError', () => {
    const error = new OxogError('Test', ErrorCodes.UNKNOWN);
    expect(isOxogError(error)).toBe(true);
  });

  it('should return true for ValidationError', () => {
    const error = new ValidationError('Invalid');
    expect(isOxogError(error)).toBe(true);
  });

  it('should return true for PluginError', () => {
    const error = new PluginError('Failed', 'test');
    expect(isOxogError(error)).toBe(true);
  });

  it('should return false for null', () => {
    expect(isOxogError(null)).toBe(false);
  });

  it('should return false for undefined', () => {
    expect(isOxogError(undefined)).toBe(false);
  });

  it('should return false for plain Error', () => {
    expect(isOxogError(new Error('Generic error'))).toBe(false);
  });

  it('should return false for object', () => {
    expect(isOxogError({ message: 'Test', code: 'TEST' })).toBe(false);
  });
});

describe('isValidationError', () => {
  it('should return true for ValidationError', () => {
    const error = new ValidationError('Invalid');
    expect(isValidationError(error)).toBe(true);
  });

  it('should return false for OxogError', () => {
    const error = new OxogError('Test', ErrorCodes.UNKNOWN);
    expect(isValidationError(error)).toBe(false);
  });

  it('should return false for PluginError', () => {
    const error = new PluginError('Failed', 'test');
    expect(isValidationError(error)).toBe(false);
  });

  it('should return false for plain Error', () => {
    expect(isValidationError(new Error('Test'))).toBe(false);
  });

  it('should return false for null', () => {
    expect(isValidationError(null)).toBe(false);
  });
});

describe('isPluginError', () => {
  it('should return true for PluginError', () => {
    const error = new PluginError('Failed', 'test');
    expect(isPluginError(error)).toBe(true);
  });

  it('should return false for OxogError', () => {
    const error = new OxogError('Test', ErrorCodes.UNKNOWN);
    expect(isPluginError(error)).toBe(false);
  });

  it('should return false for ValidationError', () => {
    const error = new ValidationError('Invalid');
    expect(isPluginError(error)).toBe(false);
  });

  it('should return false for plain Error', () => {
    expect(isPluginError(new Error('Test'))).toBe(false);
  });

  it('should return false for null', () => {
    expect(isPluginError(null)).toBe(false);
  });
});

describe('isResult', () => {
  it('should return true for Ok', () => {
    const result = Ok(42);
    expect(isResult(result)).toBe(true);
  });

  it('should return true for Err', () => {
    const result = Err('error');
    expect(isResult(result)).toBe(true);
  });

  it('should return false for null', () => {
    expect(isResult(null)).toBe(false);
  });

  it('should return false for undefined', () => {
    expect(isResult(undefined)).toBe(false);
  });

  it('should return false for primitive', () => {
    expect(isResult(42)).toBe(false);
    expect(isResult('string')).toBe(false);
    expect(isResult(true)).toBe(false);
  });

  it('should return false for object without ok property', () => {
    expect(isResult({})).toBe(false);
    expect(isResult({ value: 42 })).toBe(false);
    expect(isResult({ error: 'error' })).toBe(false);
  });

  it('should return false for object with wrong ok type', () => {
    expect(isResult({ ok: 'yes' })).toBe(false);
    expect(isResult({ ok: 1 })).toBe(false);
  });

  it('should return true for Ok with typed parameters', () => {
    const result = Ok(42);
    expect(isResult<number, string>(result)).toBe(true);
  });

  it('should return true for Err with typed parameters', () => {
    const result = Err('error');
    expect(isResult<number, string>(result)).toBe(true);
  });
});

describe('isOk', () => {
  it('should return true for Ok', () => {
    const result = Ok(42);
    expect(isOk(result)).toBe(true);
  });

  it('should return false for Err', () => {
    const result = Err('error');
    expect(isOk(result)).toBe(false);
  });

  it('should narrow type correctly', () => {
    const result: Result<number, string> = Ok(42);

    if (isOk(result)) {
      expect(result.value).toBe(42);
    }
  });

  it('should return false for null', () => {
    expect(isOk(null)).toBe(false);
  });

  it('should return false for object without ok property', () => {
    expect(isOk({})).toBe(false);
  });

  it('should return false for Err result', () => {
    const result: Result<number, string> = Err('error');
    expect(isOk(result)).toBe(false);
  });
});

describe('isErr', () => {
  it('should return true for Err', () => {
    const result = Err('error');
    expect(isErr(result)).toBe(true);
  });

  it('should return false for Ok', () => {
    const result = Ok(42);
    expect(isErr(result)).toBe(false);
  });

  it('should narrow type correctly', () => {
    const result: Result<number, string> = Err('error');

    if (isErr(result)) {
      expect(result.error).toBe('error');
    }
  });

  it('should return false for null', () => {
    expect(isErr(null)).toBe(false);
  });

  it('should return false for object without ok property', () => {
    expect(isErr({})).toBe(false);
  });

  it('should return false for Ok result', () => {
    const result: Result<number, string> = Ok(42);
    expect(isErr(result)).toBe(false);
  });
});

describe('Type Guard Combinations', () => {
  it('should handle error hierarchy correctly', () => {
    const oxogError = new OxogError('Test', ErrorCodes.UNKNOWN);
    const validationError = new ValidationError('Invalid');
    const pluginError = new PluginError('Failed', 'test');

    expect(isOxogError(oxogError)).toBe(true);
    expect(isValidationError(oxogError)).toBe(false);
    expect(isPluginError(oxogError)).toBe(false);

    expect(isOxogError(validationError)).toBe(true);
    expect(isValidationError(validationError)).toBe(true);
    expect(isPluginError(validationError)).toBe(false);

    expect(isOxogError(pluginError)).toBe(true);
    expect(isValidationError(pluginError)).toBe(false);
    expect(isPluginError(pluginError)).toBe(true);
  });

  it('should handle result narrowing', () => {
    function processResult(result: Result<number, string>): string {
      if (isOk(result)) {
        return `Success: ${result.value}`;
      }
      if (isErr(result)) {
        return `Error: ${result.error}`;
      }
      return 'Unknown';
    }

    expect(processResult(Ok(42))).toBe('Success: 42');
    expect(processResult(Err('failed'))).toBe('Error: failed');
  });
});
