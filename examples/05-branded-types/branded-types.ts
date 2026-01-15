/**
 * Example 05: Branded Types
 *
 * This example demonstrates how to use branded types for type-safe identifiers.
 */

import type { Branded, Brand } from '@oxog/types';

console.log('=== Example 05: Branded Types ===\n');

// Example 1: Create branded ID types
type UserId = Branded<string, 'UserId'>;
type OrderId = Branded<string, 'OrderId'>;
type ProductId = Brand<number, 'ProductId'>;

// Example 2: Create values with branded types
const userId: UserId = 'user_123' as UserId;
const orderId: OrderId = 'order_456' as OrderId;
const productId: ProductId = 789 as ProductId;

console.log('Branded values:');
console.log('  userId:', userId);
console.log('  orderId:', orderId);
console.log('  productId:', productId);

// Example 3: Type safety - prevents mixing IDs
function getUserById(id: UserId): string {
  return `User: ${id}`;
}

function getOrderById(id: OrderId): string {
  return `Order: ${id}`;
}

console.log('\nType-safe functions:');
console.log('  getUserById(userId):', getUserById(userId));

// This would be a TypeScript error at compile time:
// console.log('  getUserById(orderId):', getUserById(orderId));
// Error: Argument of type 'OrderId' is not assignable to parameter of type 'UserId'

// Example 4: Database entities
type DatabaseId = Brand<string, 'DatabaseId'>;

interface User {
  id: UserId;
  name: string;
  email: string;
}

interface Order {
  id: OrderId;
  userId: UserId;
  total: number;
}

interface Product {
  id: ProductId;
  name: string;
  price: number;
}

const user: User = {
  id: 'usr_001' as UserId,
  name: 'Alice',
  email: 'alice@example.com',
};

const order: Order = {
  id: 'ord_001' as OrderId,
  userId: user.id,
  total: 99.99,
};

const product: Product = {
  id: 123 as ProductId,
  name: 'Laptop',
  price: 999.99,
};

console.log('\nDatabase entities:');
console.log('  User:', user);
console.log('  Order:', order);
console.log('  Product:', product);

// Example 5: API endpoints
type ApiEndpoint = Brand<string, 'ApiEndpoint'>;

const endpoints = {
  users: '/api/users' as ApiEndpoint,
  orders: '/api/orders' as ApiEndpoint,
  products: '/api/products' as ApiEndpoint,
};

function fetchFromEndpoint(endpoint: ApiEndpoint): void {
  console.log(`Fetching from: ${endpoint}`);
}

console.log('\nAPI endpoints:');
fetchFromEndpoint(endpoints.users);
fetchFromEndpoint(endpoints.orders);

// Example 6: Event names
type EventName = Brand<string, 'EventName'>;

interface EventMap {
  'user:login': { userId: UserId };
  'user:logout': { userId: UserId };
  'order:created': { orderId: OrderId };
  'product:viewed': { productId: ProductId };
}

function emitEvent<K extends keyof EventMap>(
  event: Brand<K, 'EventName'>,
  payload: EventMap[K]
): void {
  console.log(`Event: ${event}`, payload);
}

emitEvent('user:login' as EventName, { userId: user.id });
emitEvent('order:created' as EventName, { orderId: order.id });

// Example 7: Configuration keys
type ConfigKey = Brand<string, 'ConfigKey'>;

interface Config {
  [key: ConfigKey]: string | number | boolean;
}

const config: Config = {
  'database.url' as ConfigKey: 'postgres://localhost',
  'database.port' as ConfigKey: 5432,
  'cache.enabled' as ConfigKey: true,
};

console.log('\nConfiguration:');
console.log('  database.url:', config['database.url' as ConfigKey]);
console.log('  database.port:', config['database.port' as ConfigKey]);

// Example 8: Currency codes
type CurrencyCode = Brand<string, 'CurrencyCode'>;

const USD: CurrencyCode = 'USD' as CurrencyCode;
const EUR: CurrencyCode = 'EUR' as CurrencyCode;
const GBP: CurrencyCode = 'GBP' as CurrencyCode;

interface Money {
  amount: number;
  currency: CurrencyCode;
}

const price1: Money = { amount: 99.99, currency: USD };
const price2: Money = { amount: 89.99, currency: EUR };

console.log('\nMoney:');
console.log('  Price 1:', price1);
console.log('  Price 2:', price2);

// Example 9: Status values
type Status = Brand<string, 'Status'>;

const Statuses = {
  PENDING: 'pending' as Status,
  APPROVED: 'approved' as Status,
  REJECTED: 'rejected' as Status,
} as const;

interface Request {
  id: OrderId;
  status: Status;
  amount: number;
}

const request: Request = {
  id: 'req_001' as OrderId,
  status: Statuses.PENDING,
  amount: 150.00,
};

console.log('\nRequest status:', request);

// Example 10: Combining with other utilities
type UserIdOptional = Brand<Optional<string>, 'UserId'>;
type UserIdArray = Brand<UserId[], 'UserIdArray'>;

const optionalId: UserIdOptional = undefined;
const idArray: UserIdArray = ['user_1' as UserId, 'user_2' as UserId];

console.log('\nCombined with utilities:');
console.log('  optionalId:', optionalId);
console.log('  idArray:', idArray);

console.log('\n=== End Example 05 ===\n');
