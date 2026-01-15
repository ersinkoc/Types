/**
 * Example 02: Result Type
 *
 * This example demonstrates how to use the Result type for functional error handling.
 */

import { Result, Ok, Err, isOk, isErr } from '@oxog/types';

// Example 1: Basic Result usage
function divide(a: number, b: number): Result<number, string> {
  if (b === 0) {
    return Err('Division by zero');
  }
  return Ok(a / b);
}

console.log('=== Example 02: Result Type ===\n');

// Test division
const result1 = divide(10, 2);
if (isOk(result1)) {
  console.log('✓ 10 / 2 =', result1.value);
}

const result2 = divide(10, 0);
if (isErr(result2)) {
  console.log('✗ 10 / 0 = Error:', result2.error);
}

// Example 2: Pattern matching with match
const message = result1.match({
  ok: (value) => `Success: ${value}`,
  err: (error) => `Error: ${error}`,
});
console.log('Pattern match result:', message);

// Example 3: Chaining operations
const doubled = result1
  .map((x) => x * 2)
  .map((x) => x + 10);

if (isOk(doubled)) {
  console.log('Doubled and added 10:', doubled.value); // 20
}

// Example 4: Error handling in chain
const result3 = divide(100, 5)
  .map((x) => x * 2)
  .mapErr((e) => `Calculation failed: ${e}`);

if (isOk(result3)) {
  console.log('Chained operations:', result3.value);
}

// Example 5: Unwrap with default
const value = result2.unwrapOr(0);
console.log('Unwrap with default:', value);

// Example 6: Unwrap or else with fallback
const value2 = result1.unwrapOrElse(() => 999);
console.log('Unwrap or else:', value2);

// Example 7: Real-world API simulation
interface User {
  id: number;
  name: string;
}

function fetchUser(id: number): Result<User, string> {
  if (id <= 0) {
    return Err('Invalid user ID');
  }
  if (id > 1000) {
    return Err('User not found');
  }
  return Ok({ id, name: `User ${id}` });
}

function processUserId(id: number): void {
  const user = fetchUser(id);

  const output = user.match({
    ok: (user) => `Welcome, ${user.name}!`,
    err: (error) => `Failed to fetch user: ${error}`,
  });

  console.log(output);
}

console.log('\nProcessing user IDs:');
processUserId(42);
processUserId(0);
processUserId(9999);

// Example 8: Complex chaining
function complexCalculation(input: string): Result<number, string> {
  return Ok(input)
    .map((s) => s.trim())
    .map((s) => {
      if (s.length === 0) {
        throw new Error('Empty string');
      }
      return s;
    })
    .map((s) => s.length)
    .mapErr(() => 'Input processing failed');
}

const calc1 = complexCalculation('hello');
if (isOk(calc1)) {
  console.log('String length:', calc1.value);
}

const calc2 = complexCalculation('  ');
if (isErr(calc2)) {
  console.log('Calculation error:', calc2.error);
}

// Example 9: Result with objects
function createUser(name: string, age: number): Result<User, string> {
  if (!name) {
    return Err('Name is required');
  }
  if (age < 0 || age > 150) {
    return Err('Invalid age');
  }
  return Ok({ id: Date.now(), name });
}

const userResult = createUser('Alice', 30);
if (isOk(userResult)) {
  console.log('\nCreated user:', userResult.value);
}

// Example 10: Using Result for validation
function validateEmail(email: string): Result<string, string> {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!regex.test(email)) {
    return Err('Invalid email format');
  }
  return Ok(email);
}

const emails = ['test@example.com', 'invalid-email', 'user@domain.org'];
emails.forEach((email) => {
  const result = validateEmail(email);
  const status = isOk(result) ? '✓' : '✗';
  console.log(`${status} ${email}:`, isOk(result) ? 'Valid' : result.error);
});

console.log('\n=== End Example 02 ===\n');
