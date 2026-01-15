/**
 * Example 15: Real-World Integration
 *
 * This example demonstrates how all @oxog/types features work together
 * in a real-world application scenario.
 */

import type { Plugin, Kernel, EventMap, EventHandler, TypedEventEmitter } from '../../src/plugin.js';
import type { Result, Ok, Err } from '../../src/result.js';
import { Ok as OkResult, Err as ErrResult, isOk, isErr } from '../../src/result.js';
import { OxogError, ValidationError, PluginError, ErrorCodes } from '../../src/errors.js';
import { isPlugin, isValidationError } from '../../src/guards.js';
import type { Branded, DeepPartial, MaybePromise } from '../../src/utils.js';
import type { Unsubscribe } from '../../src/utils.js';

// Define branded types for type safety
type UserId = Branded<string, 'UserId'>;
type OrderId = Branded<string, 'OrderId'>;

// Define events for the application
interface AppEvents extends EventMap {
  'user:created': { userId: UserId; email: string; timestamp: number };
  'order:placed': { orderId: OrderId; userId: UserId; amount: number };
  'order:fulfilled': { orderId: OrderId; timestamp: number };
  'error': { code: string; message: string; context?: Record<string, unknown> };
}

// Define API response types
type ApiResponse<T> = Result<T, string>;

// User service with Result type
class UserService {
  private users = new Map<UserId, { id: UserId; email: string; name: string }>();

  createUser(email: string, name: string): ApiResponse<{ id: UserId; email: string; name: string }> {
    // Validation
    if (!email || !email.includes('@')) {
      return ErrResult('Invalid email format');
    }

    if (!name || name.length < 2) {
      return ErrResult('Name must be at least 2 characters');
    }

    // Check if user exists
    for (const user of this.users.values()) {
      if (user.email === email) {
        return ErrResult('Email already registered');
      }
    }

    // Create user
    const id = `user_${Date.now()}` as UserId;
    const user = { id, email, name };
    this.users.set(id, user);

    return OkResult(user);
  }

  getUser(id: UserId): ApiResponse<{ id: UserId; email: string; name: string }> {
    const user = this.users.get(id);
    if (!user) {
      return ErrResult('User not found');
    }
    return OkResult(user);
  }
}

// Order service with error handling
class OrderService {
  private orders = new Map<OrderId, { id: OrderId; userId: UserId; amount: number }>();

  placeOrder(userId: UserId, amount: number): ApiResponse<{ id: OrderId; userId: UserId; amount: number }> {
    if (amount <= 0) {
      return ErrResult('Order amount must be positive');
    }

    const id = `order_${Date.now()}` as OrderId;
    const order = { id, userId, amount };
    this.orders.set(id, order);

    return OkResult(order);
  }

  getOrder(id: OrderId): ApiResponse<{ id: OrderId; userId: UserId; amount: number }> {
    const order = this.orders.get(id);
    if (!order) {
      return ErrResult('Order not found');
    }
    return OkResult(order);
  }
}

// Event emitter for the application
class AppEventBus implements TypedEventEmitter<AppEvents> {
  private handlers = new Map<keyof AppEvents, Set<Function>>();

  on<K extends keyof AppEvents>(
    event: K,
    handler: EventHandler<AppEvents, K>
  ): Unsubscribe {
    if (!this.handlers.has(event)) {
      this.handlers.set(event, new Set());
    }
    this.handlers.get(event)!.add(handler);
    return () => this.handlers.get(event)?.delete(handler);
  }

  off<K extends keyof AppEvents>(
    event: K,
    handler: EventHandler<AppEvents, K>
  ): void {
    this.handlers.get(event)?.delete(handler);
  }

  emit<K extends keyof AppEvents>(event: K, payload: AppEvents[K]): void {
    const handlers = this.handlers.get(event);
    if (handlers) {
      handlers.forEach((handler) => handler(payload));
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

// Logger plugin
class LoggerPlugin implements Plugin {
  readonly name = 'logger';
  readonly version = '1.0.0';

  constructor(private eventBus: AppEventBus) {}

  install(kernel: Kernel): void {
    console.log('  Logger plugin installed');

    this.eventBus.on('error', (payload) => {
      console.error(`[ERROR] ${payload.code}: ${payload.message}`, payload.context);
    });

    this.eventBus.on('user:created', (payload) => {
      console.log(`[INFO] New user created: ${payload.email}`);
    });

    this.eventBus.on('order:placed', (payload) => {
      console.log(`[INFO] Order placed: ${payload.orderId} by user ${payload.userId}`);
    });
  }

  onInit(): void {
    console.log('  Logger initialized');
  }

  onDestroy(): void {
    console.log('  Logger destroyed');
  }

  onError(error: Error): void {
    console.error('Logger plugin error:', error);
  }
}

// Notification plugin
class NotificationPlugin implements Plugin {
  readonly name = 'notifications';
  readonly version = '1.0.0';
  private subscriptions: Unsubscribe[] = [];

  constructor(private eventBus: AppEventBus) {}

  install(kernel: Kernel): void {
    console.log('  Notification plugin installed');

    const unsubscribe = this.eventBus.on('order:placed', (payload) => {
      this.sendNotification('Your order has been placed!', payload.userId);
    });

    const unsubscribe2 = this.eventBus.on('order:fulfilled', (payload) => {
      this.sendNotification('Your order has been fulfilled!', 'user_123'); // In real app, get from order
    });

    this.subscriptions.push(unsubscribe, unsubscribe2);
  }

  onInit(): void {
    console.log('  Notifications initialized');
  }

  onDestroy(): void {
    this.subscriptions.forEach((unsubscribe) => unsubscribe());
    console.log('  Notifications destroyed');
  }

  private sendNotification(message: string, userId: UserId): void {
    console.log(`    [NOTIFICATION] To ${userId}: ${message}`);
  }
}

// Analytics plugin
class AnalyticsPlugin implements Plugin {
  readonly name = 'analytics';
  readonly version = '1.0.0';

  constructor(private eventBus: AppEventBus) {}

  install(kernel: Kernel): void {
    console.log('  Analytics plugin installed');

    this.eventBus.on('user:created', (payload) => {
      this.trackEvent('user_signup', { userId: payload.userId });
    });

    this.eventBus.on('order:placed', (payload) => {
      this.trackEvent('order_created', {
        orderId: payload.orderId,
        amount: payload.amount,
      });
    });
  }

  onInit(): void {
    console.log('  Analytics initialized');
  }

  private trackEvent(event: string, properties: Record<string, unknown>): void {
    console.log(`    [ANALYTICS] Event: ${event}`, properties);
  }
}

// Main application kernel
class AppKernel implements Kernel {
  private plugins = new Map<string, Plugin>();
  private context = {};

  constructor(private eventBus: AppEventBus) {}

  use(plugin: Plugin): this {
    if (!isPlugin(plugin)) {
      throw new ValidationError('Invalid plugin structure', { plugin: plugin?.name });
    }

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
    this.eventBus.emit(event as keyof AppEvents, payload as any);
  }

  on(event: string, handler: (payload: unknown) => void): Unsubscribe {
    return this.eventBus.on(event as keyof AppEvents, handler);
  }

  getContext(): unknown {
    return this.context;
  }

  async init(): Promise<void> {
    console.log('\nInitializing plugins:');
    for (const plugin of this.plugins.values()) {
      await plugin.onInit?.(this.getContext());
    }
  }
}

// Main application
class Application {
  private kernel: AppKernel;
  private eventBus: AppEventBus;
  private userService: UserService;
  private orderService: OrderService;

  constructor() {
    this.eventBus = new AppEventBus();
    this.kernel = new AppKernel(this.eventBus);
    this.userService = new UserService();
    this.orderService = new OrderService();

    // Install plugins
    this.kernel.use(new LoggerPlugin(this.eventBus));
    this.kernel.use(new NotificationPlugin(this.eventBus));
    this.kernel.use(new AnalyticsPlugin(this.eventBus));
  }

  async start(): Promise<void> {
    console.log('=== Example 15: Real-World Integration ===\n');
    console.log('Starting application...\n');

    await this.kernel.init();

    // Run application logic
    await this.runDemo();
  }

  private async runDemo(): Promise<void> {
    console.log('\n--- Running Demo ---\n');

    // Create user
    console.log('1. Creating user:');
    const createResult = this.userService.createUser('john@example.com', 'John Doe');

    if (isOk(createResult)) {
      const user = createResult.value;
      console.log(`  ✓ User created: ${user.email}`);

      this.eventBus.emit('user:created', {
        userId: user.id,
        email: user.email,
        timestamp: Date.now(),
      });

      // Place order
      console.log('\n2. Placing order:');
      const orderResult = this.orderService.placeOrder(user.id, 99.99);

      if (isOk(orderResult)) {
        const order = orderResult.value;
        console.log(`  ✓ Order placed: ${order.id}`);

        this.eventBus.emit('order:placed', {
          orderId: order.id,
          userId: order.userId,
          amount: order.amount,
          timestamp: Date.now(),
        });

        // Simulate fulfillment
        setTimeout(() => {
          console.log('\n3. Fulfilling order:');
          this.eventBus.emit('order:fulfilled', {
            orderId: order.id,
            timestamp: Date.now(),
          });
        }, 100);
      } else {
        console.log('  ✗ Order failed:', orderResult.error);
        this.eventBus.emit('error', {
          code: 'ORDER_FAILED',
          message: orderResult.error,
          context: { userId: user.id },
        });
      }
    } else {
      console.log('  ✗ User creation failed:', createResult.error);
      this.eventBus.emit('error', {
        code: 'USER_CREATION_FAILED',
        message: createResult.error,
      });
    }

    // Demonstrate error handling
    console.log('\n4. Testing error handling:');
    this.eventBus.emit('error', {
      code: 'TEST_ERROR',
      message: 'This is a test error',
      context: { timestamp: Date.now() },
    });

    // Demonstrate validation error
    console.log('\n5. Testing validation:');
    const invalidUser = this.userService.createUser('invalid-email', 'X');
    if (isErr(invalidUser)) {
      console.log('  ✗ Validation failed:', invalidUser.error);
    }

    // Wait for async operations
    await new Promise((resolve) => setTimeout(resolve, 200));

    console.log('\n--- Demo Complete ---\n');
  }

  stop(): void {
    console.log('Stopping application...\n');
    this.kernel.unregister('notifications');
    this.kernel.unregister('analytics');
    console.log('Plugins unregistered');
  }
}

// Run the application
const app = new Application();
app.start()
  .then(() => {
    setTimeout(() => {
      app.stop();
      console.log('\n=== End Example 15 ===\n');
      process.exit(0);
    }, 500);
  })
  .catch((error) => {
    console.error('Application error:', error);
    process.exit(1);
  });
