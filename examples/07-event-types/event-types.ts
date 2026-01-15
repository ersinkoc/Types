/**
 * Example 07: Event Types
 *
 * This example demonstrates the type-safe event system.
 */

import type { EventMap, EventHandler, TypedEventEmitter } from '@oxog/types';

console.log('=== Example 07: Event Types ===\n');

// Example 1: Define event map
interface AppEvents extends EventMap {
  'user:login': { userId: string; timestamp: number };
  'user:logout': { userId: string };
  'error': Error;
  'data:update': { data: unknown };
}

type EventName = keyof AppEvents;

// Example 2: Create event handler
const loginHandler: EventHandler<AppEvents, 'user:login'> = (payload) => {
  console.log('User logged in:', payload.userId, 'at', new Date(payload.timestamp));
};

const logoutHandler: EventHandler<AppEvents, 'user:logout'> = (payload) => {
  console.log('User logged out:', payload.userId);
};

const errorHandler: EventHandler<AppEvents, 'error'> = (error) => {
  console.error('Application error:', error.message);
};

console.log('Event handlers created');

// Example 3: Simple event emitter implementation
class SimpleEmitter implements TypedEventEmitter<AppEvents> {
  private handlers = new Map<keyof AppEvents, Set<Function>>();

  on<K extends keyof AppEvents>(
    event: K,
    handler: EventHandler<AppEvents, K>
  ): () => void {
    if (!this.handlers.has(event)) {
      this.handlers.set(event, new Set());
    }
    this.handlers.get(event)!.add(handler);

    return () => {
      this.handlers.get(event)?.delete(handler);
    };
  }

  off<K extends keyof AppEvents>(
    event: K,
    handler: EventHandler<AppEvents, K>
  ): void {
    this.handlers.get(event)?.delete(handler);
  }

  emit<K extends keyof AppEvents>(event: K, payload: AppEvents[K]): void {
    const eventHandlers = this.handlers.get(event);
    if (eventHandlers) {
      eventHandlers.forEach((handler) => {
        handler(payload);
      });
    }
  }

  once<K extends keyof AppEvents>(
    event: K,
    handler: EventHandler<AppEvents, K>
  ): () => void {
    const unsubscribe = this.on(event, (payload) => {
      handler(payload);
      unsubscribe();
    });
    return unsubscribe;
  }
}

// Example 4: Using the event emitter
const emitter = new SimpleEmitter();

console.log('\n1. Subscribing to events:');
const unsubscribe1 = emitter.on('user:login', loginHandler);
const unsubscribe2 = emitter.on('user:logout', logoutHandler);
const unsubscribe3 = emitter.on('error', errorHandler);

console.log('\n2. Emitting events:');
emitter.emit('user:login', { userId: 'user_123', timestamp: Date.now() });
emitter.emit('user:logout', { userId: 'user_123' });

console.log('\n3. Unsubscribing from login events:');
unsubscribe1();
emitter.emit('user:login', { userId: 'user_456', timestamp: Date.now() });

console.log('\n4. Using once():');
const unsubscribe4 = emitter.once('user:login', (payload) => {
  console.log('This will only fire once:', payload.userId);
});

emitter.emit('user:login', { userId: 'user_789', timestamp: Date.now() });
emitter.emit('user:login', { userId: 'user_999', timestamp: Date.now() });

console.log('\n5. Off method:');
emitter.off('user:logout', logoutHandler);
emitter.emit('user:logout', { userId: 'user_111' });

// Example 5: Typed event emitter interface
interface CustomEvents extends EventMap {
  'notification': { message: string; type: 'info' | 'warning' | 'error' };
  'action': { type: string; payload: unknown };
}

class NotificationEmitter implements TypedEventEmitter<CustomEvents> {
  private notifications: Array<{ message: string; type: string }> = [];

  on<K extends keyof CustomEvents>(
    event: K,
    handler: EventHandler<CustomEvents, K>
  ): () => void {
    const unsubscribe = this.on(event, handler);
    return unsubscribe;
  }

  off<K extends keyof CustomEvents>(
    event: K,
    handler: EventHandler<CustomEvents, K>
  ): void {
    // Implementation
  }

  emit<K extends keyof CustomEvents>(event: K, payload: CustomEvents[K]): void {
    if (event === 'notification') {
      const { message, type } = payload as { message: string; type: string };
      this.notifications.push({ message, type });
      console.log(`[${type.toUpperCase()}] ${message}`);
    }
  }

  once<K extends keyof CustomEvents>(
    event: K,
    handler: EventHandler<CustomEvents, K>
  ): () => void {
    const unsubscribe = this.on(event, handler);
    return unsubscribe;
  }

  getNotifications() {
    return this.notifications;
  }
}

const notifier = new NotificationEmitter();
notifier.emit('notification', { message: 'Welcome!', type: 'info' });
notifier.emit('notification', { message: 'Memory low', type: 'warning' });

console.log('\nNotifications:', notifier.getNotifications());

// Example 6: Event map with complex types
interface ComplexEvents extends EventMap {
  'user:created': { id: string; profile: { name: string; email: string } };
  'order:processed': { orderId: string; items: Array<{ id: number; qty: number }> };
}

const complexHandler: EventHandler<ComplexEvents, 'user:created'> = (payload) => {
  console.log('User created:', payload.id, payload.profile);
};

const orderHandler: EventHandler<ComplexEvents, 'order:processed'> = (payload) => {
  console.log('Order processed:', payload.orderId, payload.items.length, 'items');
};

console.log('\nComplex event handlers work correctly');

// Example 7: Multiple handlers for same event
class MultiHandlerEmitter implements TypedEventEmitter<EventMap> {
  private events = new Map<string, Set<Function>>();

  on<K extends string>(event: K, handler: (payload: unknown) => void): () => void {
    if (!this.events.has(event)) {
      this.events.set(event, new Set());
    }
    this.events.get(event)!.add(handler);
    return () => this.events.get(event)?.delete(handler);
  }

  off<K extends string>(event: K, handler: (payload: unknown) => void): void {
    this.events.get(event)?.delete(handler);
  }

  emit<K extends string>(event: K, payload: unknown): void {
    this.events.get(event)?.forEach((handler) => handler(payload));
  }

  once<K extends string>(event: K, handler: (payload: unknown) => void): () => void {
    const unsubscribe = this.on(event, (payload) => {
      handler(payload);
      unsubscribe();
    });
    return unsubscribe;
  }
}

const multiEmitter = new MultiHandlerEmitter();

// Add multiple handlers to same event
multiEmitter.on('test', (payload) => console.log('Handler 1:', payload));
multiEmitter.on('test', (payload) => console.log('Handler 2:', payload));
multiEmitter.on('test', (payload) => console.log('Handler 3:', payload));

console.log('\nMultiple handlers for same event:');
multiEmitter.emit('test', { message: 'Hello' });

console.log('\n=== End Example 07 ===\n');
