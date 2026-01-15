/**
 * Example 06: Deep Utilities
 *
 * This example demonstrates deep utility types for working with nested structures.
 */

import type { DeepPartial, DeepReadonly, DeepRequired } from '@oxog/types';

console.log('=== Example 06: Deep Utilities ===\n');

// Example 1: DeepPartial - Make all properties optional
interface User {
  name: string;
  age: number;
  address: {
    street: string;
    city: string;
    zipCode: string;
  };
}

type PartialUser = DeepPartial<User>;

const user1: PartialUser = {
  name: 'John',
  // address and age are optional
};

const user2: PartialUser = {
  name: 'Jane',
  address: {
    street: '123 Main St',
    // city and zipCode are optional
  },
};

console.log('DeepPartial examples:');
console.log('  user1:', user1);
console.log('  user2:', user2);

// Example 2: DeepPartial with nested arrays
interface Company {
  name: string;
  employees: Array<{
    name: string;
    role: string;
    contact: {
      email: string;
      phone: string;
    };
  }>;
}

type PartialCompany = DeepPartial<Company>;

const company: PartialCompany = {
  name: 'Tech Corp',
  employees: [
    {
      name: 'Alice',
      // role is optional
      contact: {
        email: 'alice@company.com',
        // phone is optional
      },
    },
  ],
};

console.log('\nPartial company:', company);

// Example 3: DeepReadonly - Make all properties readonly
interface Config {
  api: {
    url: string;
    timeout: number;
    headers: {
      'Content-Type': string;
      Authorization: string;
    };
  };
  cache: {
    enabled: boolean;
    ttl: number;
  };
}

type ReadonlyConfig = DeepReadonly<Config>;

const config: ReadonlyConfig = {
  api: {
    url: 'https://api.example.com',
    timeout: 5000,
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer token',
    },
  },
  cache: {
    enabled: true,
    ttl: 3600,
  },
};

console.log('\nReadonly config:', config);

// TypeScript would catch this at compile time:
// config.api.url = 'https://other.com'; // Error: Cannot assign to 'url' because it is a read-only property

// Example 4: DeepRequired - Make all properties required
interface OptionalConfig {
  database?: {
    host?: string;
    port?: number;
    credentials?: {
      username?: string;
      password?: string;
    };
  };
}

type RequiredConfig = DeepRequired<OptionalConfig>;

const dbConfig: RequiredConfig = {
  database: {
    host: 'localhost',
    port: 5432,
    credentials: {
      username: 'admin',
      password: 'secret',
    },
  },
};

console.log('\nRequired config:', dbConfig);

// Example 5: Update function with DeepPartial
interface Product {
  id: number;
  name: string;
  price: number;
  details: {
    description: string;
    tags: string[];
    metadata: {
      created: Date;
      updated: Date;
    };
  };
}

function updateProduct(
  product: Product,
  updates: DeepPartial<Product>
): Product {
  return {
    ...product,
    ...updates,
    details: {
      ...product.details,
      ...updates.details,
      metadata: {
        ...product.details.metadata,
        ...updates.details?.metadata,
        updated: new Date(),
      },
    },
  };
}

const product: Product = {
  id: 1,
  name: 'Laptop',
  price: 999.99,
  details: {
    description: 'A great laptop',
    tags: ['electronics', 'computers'],
    metadata: {
      created: new Date('2024-01-01'),
      updated: new Date('2024-01-01'),
    },
  },
};

const updated = updateProduct(product, {
  price: 899.99,
  details: {
    tags: ['electronics', 'computers', 'sale'],
  },
});

console.log('\nUpdated product:', updated);

// Example 6: DeepPartial for API responses
interface ApiResponse {
  data: {
    user: {
      id: string;
      profile: {
        name: string;
        email: string;
        settings: {
          theme: string;
          notifications: boolean;
        };
      };
    };
  };
  status: number;
  message: string;
}

type PartialApiResponse = DeepPartial<ApiResponse>;

const response: PartialApiResponse = {
  data: {
    user: {
      profile: {
        name: 'John',
        // Other fields are optional
      },
    },
  },
  // status and message are optional
};

console.log('\nPartial API response:', response);

// Example 7: Nested form data
interface FormData {
  personal: {
    firstName: string;
    lastName: string;
    dateOfBirth?: string;
    address?: {
      street: string;
      city: string;
      country: string;
    };
  };
  preferences: {
    newsletter: boolean;
    notifications: {
      email: boolean;
      sms: boolean;
      push: boolean;
    };
  };
}

type PartialFormData = DeepPartial<FormData>;

const form: PartialFormData = {
  personal: {
    firstName: 'Alice',
    lastName: 'Smith',
    // dateOfBirth and address are optional
  },
  preferences: {
    newsletter: true,
    notifications: {
      email: true,
      // sms and push are optional
    },
  },
};

console.log('\nPartial form data:', form);

// Example 8: DeepRequired for validation
interface CreateUserRequest {
  username: string;
  email: string;
  profile: {
    firstName: string;
    lastName: string;
    bio?: string;
  };
}

type RequiredCreateUserRequest = DeepRequired<CreateUserRequest>;

function validateUserRequest(req: RequiredCreateUserRequest): boolean {
  console.log('Validating user request:', req);
  return true;
}

// This would require all nested properties:
const userRequest: RequiredCreateUserRequest = {
  username: 'johndoe',
  email: 'john@example.com',
  profile: {
    firstName: 'John',
    lastName: 'Doe',
    // bio is optional but must be provided for RequiredCreateUserRequest
    bio: '',
  },
};

validateUserRequest(userRequest);

console.log('\n=== End Example 06 ===\n');
