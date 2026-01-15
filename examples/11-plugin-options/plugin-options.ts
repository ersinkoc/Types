/**
 * Example 11: Plugin Options
 *
 * This example demonstrates PluginOptions and PluginLogger interfaces.
 */

import type { PluginOptions, PluginLogger } from '@oxog/types';

console.log('=== Example 11: Plugin Options ===\n');

// Example 1: Basic PluginLogger
const basicLogger: PluginLogger = {
  debug: (message, ...args) => console.log('[DEBUG]', message, ...args),
  info: (message, ...args) => console.log('[INFO]', message, ...args),
  warn: (message, ...args) => console.warn('[WARN]', message, ...args),
  error: (message, ...args) => console.error('[ERROR]', message, ...args),
};

console.log('1. Basic Logger:');
basicLogger.info('Application started');
basicLogger.debug('Debug information', { key: 'value' });
basicLogger.warn('Low memory');
basicLogger.error('Connection failed');

// Example 2: Custom logger with timestamp
const timestampLogger: PluginLogger = {
  debug: (message, ...args) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] [DEBUG]`, message, ...args);
  },
  info: (message, ...args) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] [INFO]`, message, ...args);
  },
  warn: (message, ...args) => {
    const timestamp = new Date().toISOString();
    console.warn(`[${timestamp}] [WARN]`, message, ...args);
  },
  error: (message, ...args) => {
    const timestamp = new Date().toISOString();
    console.error(`[${timestamp}] [ERROR]`, message, ...args);
  },
};

console.log('\n2. Timestamp Logger:');
timestampLogger.info('Server started', { port: 3000 });
timestampLogger.error('Database connection lost');

// Example 3: Colored logger
const coloredLogger: PluginLogger = {
  debug: (message, ...args) => {
    console.log('\x1b[36m%s\x1b[0m', '[DEBUG]', message, ...args);
  },
  info: (message, ...args) => {
    console.log('\x1b[32m%s\x1b[0m', '[INFO]', message, ...args);
  },
  warn: (message, ...args) => {
    console.log('\x1b[33m%s\x1b[0m', '[WARN]', message, ...args);
  },
  error: (message, ...args) => {
    console.log('\1b[31m%s\x1b[0m', '[ERROR]', message, ...args);
  },
};

console.log('\n3. Colored Logger (with ANSI codes):');
coloredLogger.info('Success message');
coloredLogger.warn('Warning message');
coloredLogger.error('Error message');

// Example 4: File logger
class FileLogger implements PluginLogger {
  private logs: Array<{ level: string; message: string; args: unknown[] }> = [];

  debug(message: string, ...args: unknown[]): void {
    this.logs.push({ level: 'DEBUG', message, args });
  }

  info(message: string, ...args: unknown[]): void {
    this.logs.push({ level: 'INFO', message, args });
  }

  warn(message: string, ...args: unknown[]): void {
    this.logs.push({ level: 'WARN', message, args });
  }

  error(message: string, ...args: unknown[]): void {
    this.logs.push({ level: 'ERROR', message, args });
  }

  getLogs() {
    return this.logs;
  }

  clear() {
    this.logs = [];
  }
}

const fileLogger = new FileLogger();

console.log('\n4. File Logger:');
fileLogger.info('User logged in', { userId: '123' });
fileLogger.warn('Deprecated API used', { endpoint: '/old-api' });
fileLogger.error('Payment failed', { amount: 99.99 });

console.log('  Stored logs:', fileLogger.getLogs());

// Example 5: PluginOptions
const options1: PluginOptions = {
  debug: false,
  logger: basicLogger,
};

const options2: PluginOptions = {
  debug: true,
  logger: timestampLogger,
};

const options3: PluginOptions = {};

console.log('\n5. Plugin Options:');
console.log('  Options 1:', options1);
console.log('  Options 2:', options2);
console.log('  Options 3:', options3);

// Example 6: Plugin with options
function createPlugin(name: string, options: PluginOptions = {}) {
  const logger = options.logger || console;
  const debug = options.debug || false;

  if (debug) {
    logger.debug(`Creating plugin: ${name}`);
  }

  return {
    name,
    options,
    log: logger,
    isDebug: debug,
  };
}

console.log('\n6. Plugin Creation:');
const plugin1 = createPlugin('auth-plugin', { debug: true, logger: basicLogger });
console.log('  Plugin:', plugin1.name, 'Debug:', plugin1.isDebug);

plugin1.log.info('Plugin initialized');

// Example 7: Logger levels
class LevelLogger implements PluginLogger {
  private minLevel: number;
  private logger: PluginLogger;

  constructor(minLevel: number = 0, logger?: PluginLogger) {
    this.minLevel = minLevel;
    this.logger = logger || console;
  }

  private shouldLog(level: number): boolean {
    return level >= this.minLevel;
  }

  debug(message: string, ...args: unknown[]): void {
    if (this.shouldLog(0)) {
      this.logger.debug(message, ...args);
    }
  }

  info(message: string, ...args: unknown[]): void {
    if (this.shouldLog(1)) {
      this.logger.info(message, ...args);
    }
  }

  warn(message: string, ...args: unknown[]): void {
    if (this.shouldLog(2)) {
      this.logger.warn(message, ...args);
    }
  }

  error(message: string, ...args: unknown[]): void {
    if (this.shouldLog(3)) {
      this.logger.error(message, ...args);
    }
  }
}

const verboseLogger = new LevelLogger(0, basicLogger); // Log all
const errorOnlyLogger = new LevelLogger(3, basicLogger); // Log errors only

console.log('\n7. Level Logger:');
verboseLogger.debug('This is debug');
verboseLogger.info('This is info');
errorOnlyLogger.info('This will not be shown');
errorOnlyLogger.error('This will be shown');

// Example 8: Performance logger
class PerfLogger implements PluginLogger {
  private logger: PluginLogger;

  constructor(logger: PluginLogger = console) {
    this.logger = logger;
  }

  debug(message: string, ...args: unknown[]): void {
    this.logger.debug(`[DEBUG] ${message}`, ...args);
  }

  info(message: string, ...args: unknown[]): void {
    this.logger.info(`[INFO] ${message}`, ...args);
  }

  warn(message: string, ...args: unknown[]): void {
    this.logger.warn(`[WARN] ${message}`, ...args);
  }

  error(message: string, ...args: unknown[]): void {
    this.logger.error(`[ERROR] ${message}`, ...args);
  }

  time<T>(label: string, fn: () => T): T {
    const start = Date.now();
    const result = fn();
    const duration = Date.now() - start;
    this.logger.info(`[TIMER] ${label}: ${duration}ms`);
    return result;
  }

  async timeAsync<T>(label: string, fn: () => Promise<T>): Promise<T> {
    const start = Date.now();
    const result = await fn();
    const duration = Date.now() - start;
    this.logger.info(`[TIMER] ${label}: ${duration}ms`);
    return result;
  }
}

const perfLogger = new PerfLogger(basicLogger);

console.log('\n8. Performance Logger:');
perfLogger.time('Synchronous operation', () => {
  let sum = 0;
  for (let i = 0; i < 1000000; i++) {
    sum += i;
  }
  return sum;
});

perfLogger
  .timeAsync('Async operation', async () => {
    await new Promise((resolve) => setTimeout(resolve, 100));
  })
  .then(() => {});

// Example 9: Plugin manager with options
class PluginManager {
  private options: PluginOptions;

  constructor(options: PluginOptions = {}) {
    this.options = options;
  }

  createLogger(name: string): PluginLogger {
    if (this.options.logger) {
      return {
        debug: (message, ...args) => this.options.logger!.debug(`[${name}] ${message}`, ...args),
        info: (message, ...args) => this.options.logger!.info(`[${name}] ${message}`, ...args),
        warn: (message, ...args) => this.options.logger!.warn(`[${name}] ${message}`, ...args),
        error: (message, ...args) => this.options.logger!.error(`[${name}] ${message}`, ...args),
      };
    }
    return console;
  }

  setOptions(options: PluginOptions) {
    this.options = options;
  }

  getOptions() {
    return this.options;
  }
}

const manager = new PluginManager({ debug: true, logger: basicLogger });
const pluginLogger = manager.createLogger('database-plugin');
pluginLogger.info('Connecting to database');

console.log('\n=== End Example 11 ===\n');
