import { describe, it, expect } from 'vitest';
import { OXOG_PLUGIN, OXOG_KERNEL, OXOG_VERSION, ErrorCodes } from '../../src/constants.js';

describe('OXOG_PLUGIN', () => {
  it('should be a symbol', () => {
    expect(typeof OXOG_PLUGIN).toBe('symbol');
  });

  it('should have correct description', () => {
    expect(OXOG_PLUGIN.description).toBe('@oxog/plugin');
  });

  it('should be retrievable via Symbol.for', () => {
    expect(OXOG_PLUGIN).toBe(Symbol.for('@oxog/plugin'));
  });

  it('should be usable as object key', () => {
    const obj = {
      [OXOG_PLUGIN]: true,
      name: 'test-plugin',
    };

    expect(obj[OXOG_PLUGIN]).toBe(true);
    expect(obj.name).toBe('test-plugin');
  });
});

describe('OXOG_KERNEL', () => {
  it('should be a symbol', () => {
    expect(typeof OXOG_KERNEL).toBe('symbol');
  });

  it('should have correct description', () => {
    expect(OXOG_KERNEL.description).toBe('@oxog/kernel');
  });

  it('should be retrievable via Symbol.for', () => {
    expect(OXOG_KERNEL).toBe(Symbol.for('@oxog/kernel'));
  });

  it('should be usable as object key', () => {
    const obj = {
      [OXOG_KERNEL]: true,
      name: 'test-kernel',
    };

    expect(obj[OXOG_KERNEL]).toBe(true);
    expect(obj.name).toBe('test-kernel');
  });
});

describe('OXOG_VERSION', () => {
  it('should be a string', () => {
    expect(typeof OXOG_VERSION).toBe('string');
  });

  it('should match semantic versioning format', () => {
    const semverRegex = /^\d+\.\d+\.\d+$/;
    expect(OXOG_VERSION).toMatch(semverRegex);
  });

  it('should be current version', () => {
    expect(OXOG_VERSION).toBe('1.0.3');
  });
});

describe('ErrorCodes re-export', () => {
  it('should export ErrorCodes from errors module', () => {
    expect(ErrorCodes).toBeDefined();
    expect(typeof ErrorCodes).toBe('object');
  });

  it('should have standard error codes', () => {
    expect(ErrorCodes.UNKNOWN).toBe('UNKNOWN');
    expect(ErrorCodes.VALIDATION_ERROR).toBe('VALIDATION_ERROR');
    expect(ErrorCodes.PLUGIN_ERROR).toBe('PLUGIN_ERROR');
    expect(ErrorCodes.NOT_FOUND).toBe('NOT_FOUND');
    expect(ErrorCodes.TIMEOUT).toBe('TIMEOUT');
    expect(ErrorCodes.DEPENDENCY_ERROR).toBe('DEPENDENCY_ERROR');
  });

  it('should have exactly 6 error codes', () => {
    const codes = Object.values(ErrorCodes);
    expect(codes).toHaveLength(6);
  });
});
