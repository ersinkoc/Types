import { describe, it, expect } from 'vitest';
import type { Plugin, Kernel, PluginOptions, PluginLogger } from '../../src/plugin.js';

describe('Plugin', () => {
  it('should create a valid plugin', () => {
    const plugin: Plugin = {
      name: 'test-plugin',
      version: '1.0.0',
      install: () => {},
    };

    expect(plugin.name).toBe('test-plugin');
    expect(plugin.version).toBe('1.0.0');
    expect(typeof plugin.install).toBe('function');
  });

  it('should create a plugin with dependencies', () => {
    const plugin: Plugin = {
      name: 'dependent-plugin',
      version: '1.0.0',
      dependencies: ['logger', 'cache'],
      install: () => {},
    };

    expect(plugin.dependencies).toEqual(['logger', 'cache']);
  });

  it('should create a plugin with all lifecycle hooks', () => {
    const plugin: Plugin = {
      name: 'full-plugin',
      version: '1.0.0',
      install: () => {},
      onInit: async () => {},
      onDestroy: async () => {},
      onError: () => {},
    };

    expect(typeof plugin.onInit).toBe('function');
    expect(typeof plugin.onDestroy).toBe('function');
    expect(typeof plugin.onError).toBe('function');
  });

  it('should create a plugin with generic context', () => {
    interface MyContext {
      config: Record<string, unknown>;
    }

    const plugin: Plugin<MyContext> = {
      name: 'context-plugin',
      version: '1.0.0',
      install: (kernel) => {
        const context = kernel.getContext();
        expect(context.config).toBeDefined();
      },
    };

    expect(plugin.name).toBe('context-plugin');
  });
});

describe('Kernel', () => {
  it('should create a minimal kernel', () => {
    const kernel: Kernel = {
      use: () => kernel,
      unregister: () => true,
      getPlugin: () => undefined,
      listPlugins: () => [],
      hasPlugin: () => false,
      emit: () => {},
      on: () => () => {},
      getContext: () => null,
    };

    expect(kernel.use).toBeDefined();
    expect(kernel.unregister).toBeDefined();
    expect(kernel.getPlugin).toBeDefined();
    expect(kernel.listPlugins).toBeDefined();
    expect(kernel.hasPlugin).toBeDefined();
    expect(kernel.emit).toBeDefined();
    expect(kernel.on).toBeDefined();
    expect(kernel.getContext).toBeDefined();
  });

  it('should create a kernel with typed context', () => {
    interface MyContext {
      config: Record<string, unknown>;
    }

    const kernel: Kernel<MyContext> = {
      use: () => kernel,
      unregister: () => true,
      getPlugin: () => undefined,
      listPlugins: () => [],
      hasPlugin: () => false,
      emit: () => {},
      on: () => () => {},
      getContext: () => ({ config: {} }),
    };

    const context = kernel.getContext();
    expect(context.config).toBeDefined();
  });

  it('should support method chaining', () => {
    const kernel: Kernel = {
      use: () => kernel,
      unregister: () => true,
      getPlugin: () => undefined,
      listPlugins: () => [],
      hasPlugin: () => false,
      emit: () => {},
      on: () => () => {},
      getContext: () => null,
    };

    const plugin: Plugin = {
      name: 'test',
      version: '1.0.0',
      install: () => {},
    };

    const result = kernel.use(plugin);
    expect(result).toBe(kernel);
  });
});

describe('PluginOptions', () => {
  it('should create default options', () => {
    const options: PluginOptions = {};

    expect(options.debug).toBeUndefined();
    expect(options.logger).toBeUndefined();
  });

  it('should create options with debug enabled', () => {
    const options: PluginOptions = {
      debug: true,
    };

    expect(options.debug).toBe(true);
  });

  it('should create options with custom logger', () => {
    const logger: PluginLogger = {
      debug: () => {},
      info: () => {},
      warn: () => {},
      error: () => {},
    };

    const options: PluginOptions = {
      logger,
    };

    expect(options.logger).toBe(logger);
  });

  it('should create options with all properties', () => {
    const logger: PluginLogger = {
      debug: () => {},
      info: () => {},
      warn: () => {},
      error: () => {},
    };

    const options: PluginOptions = {
      debug: true,
      logger,
    };

    expect(options.debug).toBe(true);
    expect(options.logger).toBe(logger);
  });
});

describe('PluginLogger', () => {
  it('should create a logger with all methods', () => {
    const logger: PluginLogger = {
      debug: () => {},
      info: () => {},
      warn: () => {},
      error: () => {},
    };

    expect(typeof logger.debug).toBe('function');
    expect(typeof logger.info).toBe('function');
    expect(typeof logger.warn).toBe('function');
    expect(typeof logger.error).toBe('function');
  });

  it('should create a console logger', () => {
    const logger: PluginLogger = {
      debug: (message, ...args) => console.log('[DEBUG]', message, ...args),
      info: (message, ...args) => console.info('[INFO]', message, ...args),
      warn: (message, ...args) => console.warn('[WARN]', message, ...args),
      error: (message, ...args) => console.error('[ERROR]', message, ...args),
    };

    expect(typeof logger.debug).toBe('function');
    expect(typeof logger.info).toBe('function');
    expect(typeof logger.warn).toBe('function');
    expect(typeof logger.error).toBe('function');
  });
});
