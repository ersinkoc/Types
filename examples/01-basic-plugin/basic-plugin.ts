/**
 * Example 01: Basic Plugin
 *
 * This example demonstrates how to create a basic plugin using the @oxog/types package.
 */

import type { Plugin, Kernel } from '@oxog/types';

// Example 1: Simple plugin
const loggerPlugin: Plugin = {
  name: 'logger',
  version: '1.0.0',
  install(kernel) {
    console.log('Logger plugin installed');
    // Listen for events
    kernel.on('log', (message) => {
      console.log('[LOG]', message);
    });
  },
  onInit() {
    console.log('Logger initialized');
  },
};

// Example 2: Plugin with dependencies
const databasePlugin: Plugin = {
  name: 'database',
  version: '1.0.0',
  dependencies: ['logger'],
  install(kernel) {
    console.log('Database plugin installed');
    // Use logger dependency
    const logger = kernel.getPlugin('logger');
    if (logger) {
      kernel.emit('log', 'Database connected');
    }
  },
};

// Example 3: Plugin with lifecycle hooks
const authPlugin: Plugin = {
  name: 'auth',
  version: '1.0.0',
  install(kernel) {
    console.log('Auth plugin installed');

    // Set up event handlers
    kernel.on('login', (credentials) => {
      console.log('Login attempt:', credentials);
    });

    kernel.on('logout', (userId) => {
      console.log('User logged out:', userId);
    });
  },
  onInit(context) {
    console.log('Auth plugin initialized');
  },
  onDestroy() {
    console.log('Auth plugin destroyed');
  },
  onError(error) {
    console.error('Auth plugin error:', error);
  },
};

// Example 4: Complete plugin with error handling
const cachePlugin: Plugin = {
  name: 'cache',
  version: '1.0.0',
  install(kernel) {
    console.log('Cache plugin installed');

    // Simulate cache operations
    kernel.on('cache:set', (data) => {
      console.log('Cache set:', data);
    });

    kernel.on('cache:get', (key) => {
      console.log('Cache get:', key);
    });
  },
  onInit(context) {
    console.log('Cache plugin initialized with context:', context);
  },
  onError(error) {
    console.error('Cache plugin error:', error);
    // Attempt recovery or cleanup
  },
};

// Example 5: Kernel usage
function createKernel() {
  const kernel: Kernel = {
    use(plugin) {
      console.log(`Registering plugin: ${plugin.name}`);
      plugin.install(this);
      return this;
    },
    unregister(name) {
      console.log(`Unregistering plugin: ${name}`);
      return true;
    },
    getPlugin(name) {
      console.log(`Getting plugin: ${name}`);
      return undefined;
    },
    listPlugins() {
      return [];
    },
    hasPlugin(name) {
      return false;
    },
    emit(event, payload) {
      console.log(`Emitting event: ${event}`, payload);
    },
    on(event, handler) {
      console.log(`Listening to event: ${event}`);
      return () => {};
    },
    getContext() {
      return {};
    },
  };

  return kernel;
}

// Run example
console.log('=== Example 01: Basic Plugin ===\n');

const kernel = createKernel();

console.log('\n1. Installing logger plugin:');
kernel.use(loggerPlugin);

console.log('\n2. Installing auth plugin:');
kernel.use(authPlugin);

console.log('\n3. Emitting events:');
kernel.emit('log', 'Hello from kernel');
kernel.emit('login', { username: 'john' });
kernel.emit('logout', 'user123');

console.log('\n=== End Example 01 ===\n');
