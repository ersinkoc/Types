/**
 * Example 12: Strict Pick/Omit
 *
 * This example demonstrates StrictPick and StrictOmit utilities.
 */

import type { StrictPick, StrictOmit } from '@oxog/types';

console.log('=== Example 12: Strict Pick/Omit ===\n');

interface User {
  id: number;
  name: string;
  email: string;
  age: number;
  address: string;
}

// Example 1: StrictPick - Select specific properties
type UserBasicInfo = StrictPick<User, 'id' | 'name'>;

const userBasic: UserBasicInfo = {
  id: 1,
  name: 'John Doe',
  // email and age are not allowed
};

console.log('1. StrictPick - UserBasicInfo:');
console.log('  userBasic:', userBasic);

// Example 2: StrictOmit - Remove specific properties
type UserPublic = StrictOmit<User, 'id' | 'email'>;

const userPublic: UserPublic = {
  name: 'Jane Smith',
  age: 30,
  address: '123 Main St',
  // id and email are removed
};

console.log('\n2. StrictOmit - UserPublic:');
console.log('  userPublic:', userPublic);

// Example 3: API Response types
interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
  timestamp: string;
}

type ApiSuccess<T> = StrictPick<ApiResponse<T>, 'data' | 'status'>;

const successResponse: ApiSuccess<string> = {
  data: 'Success',
  status: 200,
  // message and timestamp are not allowed
};

console.log('\n3. API Success Response:');
console.log('  successResponse:', successResponse);

type ApiError = StrictOmit<ApiResponse<unknown>, 'data'>;

const errorResponse: ApiError = {
  status: 400,
  message: 'Bad Request',
  timestamp: new Date().toISOString(),
  // data is removed
};

console.log('  errorResponse:', errorResponse);

// Example 4: Database entities
interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  createdAt: Date;
  updatedAt: Date;
}

type ProductSummary = StrictPick<Product, 'id' | 'name' | 'price'>;

const productSummary: ProductSummary = {
  id: 1,
  name: 'Laptop',
  price: 999.99,
};

console.log('\n4. Product Summary:');
console.log('  productSummary:', productSummary);

type ProductInput = StrictOmit<Product, 'id' | 'createdAt' | 'updatedAt'>;

const newProduct: ProductInput = {
  name: 'Mouse',
  description: 'Wireless mouse',
  price: 29.99,
  stock: 100,
};

console.log('  newProduct:', newProduct);

// Example 5: Form validation
interface FormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

type LoginForm = StrictPick<FormData, 'email' | 'password'>;
type RegisterForm = StrictOmit<FormData, 'confirmPassword'>;

const loginData: LoginForm = {
  email: 'user@example.com',
  password: 'secret123',
};

const registerData: RegisterForm = {
  username: 'johndoe',
  email: 'john@example.com',
  password: 'secret123',
  confirmPassword: 'secret123',
};

console.log('\n5. Form Data:');
console.log('  loginData:', loginData);
console.log('  registerData:', registerData);

// Example 6: Configuration object
interface Config {
  apiUrl: string;
  apiKey: string;
  timeout: number;
  retries: number;
  debug: boolean;
}

type PublicConfig = StrictOmit<Config, 'apiKey'>;

const config: PublicConfig = {
  apiUrl: 'https://api.example.com',
  timeout: 5000,
  retries: 3,
  debug: false,
};

console.log('\n6. Public Configuration:');
console.log('  config:', config);

// Example 7: Update operations
type UserUpdate = StrictPick<User, 'name' | 'email'>;

function updateUser(id: number, update: UserUpdate): void {
  console.log('  Updating user', id, 'with:', update);
}

updateUser(1, { name: 'John Smith', email: 'john@example.com' });
// updateUser(1, { age: 30 }); // TypeScript error: 'age' is not in UserUpdate

// Example 8: Response mapping
type UserDTO = {
  id: number;
  fullName: string;
  emailAddress: string;
  yearsOld: number;
  location: string;
};

type UserView = StrictPick<UserDTO, 'id' | 'fullName' | 'emailAddress'>;

function mapUserToView(user: User): UserView {
  return {
    id: user.id,
    fullName: user.name,
    emailAddress: user.email,
  };
}

const user: User = {
  id: 1,
  name: 'Alice Johnson',
  email: 'alice@example.com',
  age: 25,
  address: '456 Oak Ave',
};

const userView = mapUserToView(user);

console.log('\n7. User Mapping:');
console.log('  userView:', userView);

// Example 9: Component props
interface ButtonProps {
  onClick: () => void;
  disabled: boolean;
  variant: 'primary' | 'secondary' | 'danger';
  size: 'small' | 'medium' | 'large';
  children: unknown;
}

type IconButtonProps = StrictOmit<ButtonProps, 'children'> & {
  icon: string;
};

const iconButton: IconButtonProps = {
  onClick: () => console.log('Clicked'),
  disabled: false,
  variant: 'primary',
  size: 'medium',
  icon: 'search',
};

console.log('\n8. Icon Button Props:');
console.log('  iconButton:', iconButton);

// Example 10: Type safety check
function createQuery<T, K extends keyof T>(obj: T, keys: StrictPick<T, K>[]) {
  return keys;
}

const userKeys = createQuery(user, [
  { id: 1, name: 'John' },
  { id: 2, name: 'Jane' },
]);

console.log('\n9. Type-safe query:');
console.log('  userKeys:', userKeys);

// Example 11: Combining StrictPick and StrictOmit
type UserContact = StrictPick<User, 'name' | 'email'>;
type UserDetails = StrictOmit<User, 'email'>;

const contact: UserContact = {
  name: 'Bob Wilson',
  email: 'bob@example.com',
};

const details: UserDetails = {
  id: 3,
  name: 'Bob Wilson',
  age: 35,
  address: '789 Pine St',
};

console.log('\n10. Combined Usage:');
console.log('  contact:', contact);
console.log('  details:', details);

console.log('\n=== End Example 12 ===\n');
