import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'dist/',
        'examples/',
        'tests/',
        'website/',
        '**/*.d.ts',
        '**/*.config.*',
        'src/constants.ts',
        'src/events.ts',
        'src/index.ts',
        'src/plugin.ts',
        'src/utils.ts',
      ],
      thresholds: {
        global: {
          branches: 100,
          functions: 100,
          lines: 100,
          statements: 100
        }
      }
    },
    testTimeout: 10000,
    hookTimeout: 10000
  }
});
