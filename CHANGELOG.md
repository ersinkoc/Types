# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.2] - 2026-01-17

### Added
- New utility types: `ValueOf`, `RequireKeys`, `OptionalKeys`, `KeysOfType`, `NonNullish`, `Mutable`, `DeepMutable`, `Tuple`, `ArrayElement`, `LiteralUnion`
- Tests for `constants.ts` module (OXOG_PLUGIN, OXOG_KERNEL, OXOG_VERSION, ErrorCodes)
- 37 new tests for utility types and constants

### Changed
- `constants.ts` now included in test coverage
- Total test count increased from 192 to 229

### Fixed
- `tsup.config.ts` duplicate configuration removed
- `PluginError` now always includes `pluginName` in context for consistent debugging

### Improved
- Package exports now include sub-module paths for semantic imports
- All runtime code now has 100% test coverage

## [1.0.1] - 2026-01-15

### Fixed
- Removed accidental prismjs runtime dependency from package.json
- Fixed vitest.config.ts to exclude website folder from coverage
- Removed stale compiled vite.config.js from website

### Changed
- Added prismjs and @types/prismjs to website devDependencies (website-only)
- Updated OXOG_VERSION constant to 1.0.1

### Improved
- Cleaner coverage report (src only: errors.ts, guards.ts, result.ts)
- Zero runtime dependencies maintained as per spec

## [1.0.0] - 2026-01-15

### Added
- Initial release of @oxog/types
- Micro-kernel plugin architecture with Plugin<T> and Kernel<T> interfaces
- Rust-inspired Result<T, E> type for functional error handling
- Comprehensive error classes (OxogError, ValidationError, PluginError)
- Runtime type guards (isPlugin, isKernel, isOk, isErr, isResult, etc.)
- Utility types (Branded, DeepPartial, DeepReadonly, DeepRequired, MaybePromise, etc.)
- Event system types (EventMap, EventHandler, TypedEventEmitter)
- JSON types (JsonPrimitive, JsonArray, JsonObject, JsonValue)
- Object utilities (Prettify, StrictOmit, StrictPick, NonEmptyArray, etc.)
- Well-known symbols and constants (OXOG_PLUGIN, OXOG_KERNEL, OXOG_VERSION)
- 100% test coverage with 192 tests
- 15 comprehensive examples demonstrating all features
- LLM-optimized documentation (llms.txt)
- GitHub Actions workflows for CI/CD
- Dual build system (ESM + CJS) with TypeScript declarations

### Features
- Zero runtime dependencies
- TypeScript strict mode support
- Bundle size under 3KB (2.46 KB ESM, 2.55 KB CJS)
- Universal (Node.js + Browser) compatibility
- Node.js >= 18 support
- TypeScript >= 5.0 support

### Documentation
- Comprehensive README with badges and examples
- LLM-native documentation for AI assistance
- Well-documented API with JSDoc comments
- Real-world integration example
- Architecture documentation (IMPLEMENTATION.md, SPECIFICATION.md)

### Testing
- Vitest test runner with V8 coverage provider
- Unit tests for all modules
- Integration tests
- 100% code coverage on runtime code
