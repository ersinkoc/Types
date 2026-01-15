/**
 * Example 10: Kernel Interface
 *
 * This example demonstrates the Kernel interface and its methods.
 */

import type { Kernel, Plugin } from '@oxog/types';

console.log('=== Example 10: Kernel Interface ===\n');

// Example 1: Minimal Kernel implementation
class BasicKernel implements Kernel {
  private plugins = new Map<string, Plugin>();

  use(plugin: Plugin): this {
    this.plugins.set(plugin.name, plugin);
    plugin.install(this);
    console.log(`  Plugin '${plugin.name}' registered`);
    return this;
  }

  unregister(name: string): boolean {
    const plugin = this.plugins.get(name);
    if (plugin) {
      plugin.onDestroy?.();
      return this.plugins.delete(name);
    }
    return false;
  }

  getPlugin<T extends Plugin>(name: string): T | undefined {
    return this.plugins.get(name) as T | undefined;
  }

  listPlugins(): ReadonlyArray<Plugin> {
    return Array.from(this.plugins.values());
  }

  hasPlugin(name: string): boolean {
    return this.plugins.has(name);
  }

  emit(event: string, payload?: unknown): void {
    console.log(`  Emitting event '${event}':`, payload);
    // In real implementation, notify all plugins
  }

  on(event: string, handler: (payload: unknown) => void): () => void {
    console.log(`  Subscribing to event '${event}'`);
    return () => console.log(`  Unsubscribing from event '${event}'`);
  }

  getContext(): unknown {
    return { timestamp: Date.now() };
  }
}

const kernel = new BasicKernel();

console.log('1. Basic Kernel:');
const plugin1: Plugin = {
  name: 'logger',
  version: '1.0.0',
  install: (k) => {
    console.log('    Logger plugin installing...');
  },
};

const plugin2: Plugin = {
  name: 'auth',
  version: '1.0.0',
  install: (k) => {
    console.log('    Auth plugin installing...');
  },
};

kernel.use(plugin1);
kernel.use(plugin2);

// Example 2: Method chaining
console.log('\n2. Method chaining:');
kernel
  .use({
    name: 'cache',
    version: '1.0.0',
    install: () => {},
  })
  .use({
    name: 'api',
    version: '1.0.0',
    install: () => {},
  });

console.log('  All plugins:', kernel.listPlugins().map((p) => p.name));

// Example 3: Check plugin existence
console.log('\n3. Plugin existence check:');
console.log('  Has logger:', kernel.hasPlugin('logger'));
console.log('  Has database:', kernel.hasPlugin('database'));

// Example 4: Get plugin
console.log('\n4. Get plugin:');
const logger = kernel.getPlugin('logger');
if (logger) {
  console.log('  Found plugin:', logger.name, logger.version);
}

// Example 5: Unregister plugin
console.log('\n5. Unregister plugin:');
const removed = kernel.unregister('cache');
console.log('  Removed cache:', removed);
console.log('  Remaining plugins:', kernel.listPlugins().map((p) => p.name));

// Example 6: Event system
console.log('\n6. Event system:');
const unsubscribe = kernel.on('user:login', (payload) => {
  console.log('  Login event received:', payload);
});

kernel.emit('user:login', { userId: 'user_123', timestamp: Date.now() });

// Example 7: Context
console.log('\n7. Context:');
const context = kernel.getContext();
console.log('  Context:', context);

// Example 8: Typed Kernel
interface AppContext {
  config: Record<string, unknown>;
  services: Map<string, unknown>;
}

class TypedKernel implements Kernel<AppContext> {
  private plugins = new Map<string, Plugin<AppContext>>();
  private context: AppContext = {
    config: {},
    services: new Map(),
  };

  use(plugin: Plugin<AppContext>): this {
    this.plugins.set(plugin.name, plugin);
    plugin.install(this);
    return this;
  }

  unregister(name: string): boolean {
    return this.plugins.delete(name);
  }

  getPlugin<T extends Plugin<AppContext>>(name: string): T | undefined {
    return this.plugins.get(name) as T | undefined;
  }

  listPlugins(): ReadonlyArray<Plugin<AppContext>> {
    return Array.from(this.plugins.values());
  }

  hasPlugin(name: string): boolean {
    return this.plugins.has(name);
  }

  emit(event: string, payload?: unknown): void {
    console.log(`  Event '${event}':`, payload);
  }

  on(event: string, handler: (payload: unknown) => void): () => void {
    return () => {};
  }

  getContext(): AppContext {
    return this.context;
  }
}

const typedKernel = new TypedKernel();

console.log('\n8. Typed Kernel:');
typedKernel.use({
  name: 'database',
  version: '1.0.0',
  install: (k) => {
    const ctx = k.getContext();
    ctx.services.set('db', { connected: true });
    console.log('  Database service registered');
  },
});

const typedContext = typedKernel.getContext();
console.log('  Context services:', Array.from(typedContext.services.keys()));

// Example 9: Plugin with dependencies
console.log('\n9. Plugin dependencies:');
const dependencyKernel = new BasicKernel();

const loggerPlugin: Plugin = {
  name: 'logger',
  version: '1.0.0',
  install: (k) => {
    console.log('    Logger: Initialized');
  },
};

const appPlugin: Plugin = {
  name: 'app',
  version: '1.0.0',
  dependencies: ['logger'],
  install: (k) => {
    if (k.hasPlugin('logger')) {
      console.log('    App: Logger dependency satisfied');
    } else {
      console.log('    App: Logger dependency missing!');
    }
  },
};

dependencyKernel.use(loggerPlugin);
dependencyKernel.use(appPlugin);

// Example 10: Full workflow
console.log('\n10. Full workflow:');
const workflowKernel = new BasicKernel();

const plugins: Plugin[] = [
  {
    name: 'config',
    version: '1.0.0',
    install: (k) => console.log('  Initializing config...'),
    onInit: (ctx) => console.log('  Config initialized'),
  },
  {
    name: 'database',
    version: '1.0.0',
    install: (k) => console.log('  Connecting to database...'),
    onInit: (ctx) => console.log('  Database connected'),
  },
  {
    name: 'server',
    version: '1.0.0',
    dependencies: ['config', 'database'],
    install: (k) => console.log('  Starting server...'),
    onInit: (ctx) => console.log('  Server started'),
  },
];

plugins.forEach((plugin) => workflowKernel.use(plugin));

console.log('\n  Registered plugins:', workflowKernel.listPlugins().map((p) => p.name));

workflowKernel.emit('startup', { time: Date.now() });
workflowKernel.emit('ready', { status: 'ok' });

workflowKernel.unregister('server');
console.log('  After unregister:', workflowKernel.listPlugins().map((p) => p.name));

console.log('\n=== End Example 10 ===\n');
