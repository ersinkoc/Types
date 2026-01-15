/**
 * Example 14: Typed Emitter
 *
 * This example demonstrates the full TypedEventEmitter interface.
 */

import type { EventMap, EventHandler, TypedEventEmitter, Unsubscribe } from '@oxog/types';

console.log('=== Example 14: Typed Emitter ===\n');

// Example 1: Define events for an application
interface AppEvents extends EventMap {
  'user:login': { userId: string; username: string; timestamp: number };
  'user:logout': { userId: string; timestamp: number };
  'user:register': { userId: string; email: string; timestamp: number };
  'error': { code: string; message: string; details?: unknown };
  'notification': { id: string; message: string; type: 'info' | 'warning' | 'error' };
}

// Example 2: Implement a typed event emitter
class TypedEventBus implements TypedEventEmitter<AppEvents> {
  private handlers = new Map<keyof AppEvents, Set<Function>>();

  on<K extends keyof AppEvents>(
    event: K,
    handler: EventHandler<AppEvents, K>
  ): Unsubscribe {
    if (!this.handlers.has(event)) {
      this.handlers.set(event, new Set());
    }
    this.handlers.get(event)!.add(handler);

    console.log(`  Subscribed to '${String(event)}'`);

    return () => {
      this.handlers.get(event)?.delete(handler);
      console.log(`  Unsubscribed from '${String(event)}'`);
    };
  }

  off<K extends keyof AppEvents>(
    event: K,
    handler: EventHandler<AppEvents, K>
  ): void {
    this.handlers.get(event)?.delete(handler);
    console.log(`  Removed handler for '${String(event)}'`);
  }

  emit<K extends keyof AppEvents>(event: K, payload: AppEvents[K]): void {
    const eventHandlers = this.handlers.get(event);
    if (eventHandlers) {
      console.log(`  Emitting '${String(event)}' with:`, payload);
      eventHandlers.forEach((handler) => {
        try {
          handler(payload);
        } catch (error) {
          console.error('  Handler error:', error);
        }
      });
    } else {
      console.log(`  Emitting '${String(event)}' (no handlers)`);
    }
  }

  once<K extends keyof AppEvents>(
    event: K,
    handler: EventHandler<AppEvents, K>
  ): Unsubscribe {
    const unsubscribe = this.on(event, (payload) => {
      handler(payload);
      unsubscribe();
    });
    return unsubscribe;
  }
}

// Example 3: Create event bus instance
const eventBus = new TypedEventBus();

console.log('1. EventBus created');

// Example 4: Subscribe to events
console.log('\n2. Subscribing to events:');

const unsubscribeLogin = eventBus.on('user:login', (payload) => {
  console.log(`    → Login: ${payload.username} (${payload.userId})`);
});

const unsubscribeLogout = eventBus.on('user:logout', (payload) => {
  console.log(`    → Logout: ${payload.userId}`);
});

const unsubscribeNotification = eventBus.on('notification', (payload) => {
  console.log(`    → [${payload.type.toUpperCase()}] ${payload.message}`);
});

const unsubscribeError = eventBus.on('error', (payload) => {
  console.error(`    → ERROR [${payload.code}]: ${payload.message}`, payload.details);
});

// Example 5: Emit events
console.log('\n3. Emitting events:');

eventBus.emit('user:login', {
  userId: 'user_123',
  username: 'alice',
  timestamp: Date.now(),
});

eventBus.emit('notification', {
  id: 'notif_001',
  message: 'Welcome to the application!',
  type: 'info',
});

eventBus.emit('user:logout', {
  userId: 'user_123',
  timestamp: Date.now(),
});

// Example 6: Use once() for one-time subscriptions
console.log('\n4. One-time subscription:');

const unsubscribeOnce = eventBus.once('user:register', (payload) => {
  console.log(`    → First registration: ${payload.email}`);
});

eventBus.emit('user:register', {
  userId: 'user_456',
  email: 'newuser@example.com',
  timestamp: Date.now(),
});

eventBus.emit('user:register', {
  userId: 'user_789',
  email: 'another@example.com',
  timestamp: Date.now(),
});

console.log('    (Second registration won't trigger the once handler)');

// Example 7: Unsubscribe
console.log('\n5. Unsubscribing:');

unsubscribeLogin();
unsubscribeNotification();

eventBus.emit('user:login', {
  userId: 'user_999',
  username: 'bob',
  timestamp: Date.now(),
});

// Example 8: Using off() method
console.log('\n6. Using off() method:');

const handler = (payload: AppEvents['user:login']) => {
  console.log(`    → Handler called: ${payload.username}`);
};

eventBus.on('user:login', handler);
eventBus.emit('user:login', {
  userId: 'user_111',
  username: 'charlie',
  timestamp: Date.now(),
});

eventBus.off('user:login', handler);
eventBus.emit('user:login', {
  userId: 'user_222',
  username: 'david',
  timestamp: Date.now(),
});

// Example 9: Error handling
console.log('\n7. Error handling:');

eventBus.emit('error', {
  code: 'CONNECTION_FAILED',
  message: 'Unable to connect to database',
  details: { host: 'localhost', port: 5432 },
});

// Example 10: Multiple handlers for same event
console.log('\n8. Multiple handlers:');

eventBus.on('notification', (payload) => {
  console.log(`    → Handler 1: ${payload.message}`);
});

eventBus.on('notification', (payload) => {
  console.log(`    → Handler 2: ${payload.type}`);
});

eventBus.emit('notification', {
  id: 'notif_002',
  message: 'Multiple handlers test',
  type: 'warning',
});

// Example 11: Event emitter as plugin
class Plugin {
  private unsubscribe?: Unsubscribe;

  constructor(private eventBus: TypedEventEmitter<AppEvents>) {}

  init(): void {
    this.unsubscribe = this.eventBus.on('user:login', (payload) => {
      console.log(`    [Plugin] User ${payload.username} logged in`);
    });

    console.log('  Plugin initialized');
  }

  destroy(): void {
    this.unsubscribe?.();
    console.log('  Plugin destroyed');
  }
}

const plugin = new Plugin(eventBus);
plugin.init();

eventBus.emit('user:login', {
  userId: 'user_plugin',
  username: 'plugin_user',
  timestamp: Date.now(),
});

plugin.destroy();

eventBus.emit('user:login', {
  userId: 'user_after_plugin',
  username: 'after_plugin',
  timestamp: Date.now(),
});

// Example 12: Channel-based event bus
class ChannelEventBus implements TypedEventEmitter<AppEvents> {
  private channels = new Map<string, Set<Function>>();

  on<K extends keyof AppEvents>(
    channel: K,
    handler: EventHandler<AppEvents, K>
  ): Unsubscribe {
    if (!this.channels.has(String(channel))) {
      this.channels.set(String(channel), new Set());
    }
    this.channels.get(String(channel))!.add(handler);

    return () => {
      this.channels.get(String(channel))?.delete(handler);
    };
  }

  off<K extends keyof AppEvents>(
    channel: K,
    handler: EventHandler<AppEvents, K>
  ): void {
    this.channels.get(String(channel))?.delete(handler);
  }

  emit<K extends keyof AppEvents>(
    channel: K,
    payload: AppEvents[K]
  ): void {
    const handlers = this.channels.get(String(channel));
    if (handlers) {
      handlers.forEach((handler) => handler(payload));
    }
  }

  once<K extends keyof AppEvents>(
    channel: K,
    handler: EventHandler<AppEvents, K>
  ): Unsubscribe {
    const unsubscribe = this.on(channel, (payload) => {
      handler(payload);
      unsubscribe();
    });
    return unsubscribe;
  }
}

console.log('\n9. Channel-based event bus:');
const channelBus = new ChannelEventBus();

channelBus.on('user:login', (payload) => {
  console.log(`    [Channel] Login: ${payload.username}`);
});

channelBus.emit('user:login', {
  userId: 'ch_001',
  username: 'channel_user',
  timestamp: Date.now(),
});

console.log('\n=== End Example 14 ===\n');
