import { describe, it, expect } from 'vitest';
import { Result, Ok, Err } from '../../src/result.js';
import { isOk, isErr, isResult } from '../../src/guards.js';

describe('Ok', () => {
  it('should create Ok instance with value', () => {
    const ok = Ok(42);

    expect(ok.ok).toBe(true);
    expect(ok.value).toBe(42);
    expect(ok.error).toBeUndefined();
  });

  it('should create Ok instance with string', () => {
    const ok = Ok('hello');

    expect(ok.ok).toBe(true);
    expect(ok.value).toBe('hello');
  });

  it('should create Ok instance with object', () => {
    const ok = Ok({ id: 1, name: 'test' });

    expect(ok.ok).toBe(true);
    expect(ok.value).toEqual({ id: 1, name: 'test' });
  });

  it('should create Ok instance with null', () => {
    const ok = Ok(null);

    expect(ok.ok).toBe(true);
    expect(ok.value).toBe(null);
  });

  it('should create Ok instance with undefined', () => {
    const ok = Ok(undefined);

    expect(ok.ok).toBe(true);
    expect(ok.value).toBeUndefined();
  });

  describe('map', () => {
    it('should transform value with map', () => {
      const ok = Ok(42);
      const mapped = ok.map((x) => x * 2);

      expect(isOk(mapped)).toBe(true);
      expect(mapped.value).toBe(84);
    });

    it('should chain map operations', () => {
      const ok = Ok(5);
      const result = ok
        .map((x) => x + 1)
        .map((x) => x * 2)
        .map((x) => x.toString());

      expect(isOk(result)).toBe(true);
      expect(result.value).toBe('12');
    });

    it('should map to different type', () => {
      const ok = Ok(42);
      const mapped = ok.map((x) => ({ value: x }));

      expect(isOk(mapped)).toBe(true);
      expect(mapped.value).toEqual({ value: 42 });
    });
  });

  describe('mapErr', () => {
    it('should not transform error (no-op)', () => {
      const ok = Ok(42);
      const result = ok.mapErr((e) => 'new error');

      expect(result).toBe(ok);
      expect(isOk(result)).toBe(true);
      expect(result.value).toBe(42);
    });
  });

  describe('match', () => {
    it('should call ok handler', () => {
      const ok = Ok(42);
      const result = ok.match({
        ok: (value) => `Value: ${value}`,
        err: () => 'Error',
      });

      expect(result).toBe('Value: 42');
    });
  });

  describe('unwrap', () => {
    it('should return the value', () => {
      const ok = Ok(42);
      const value = ok.unwrap();

      expect(value).toBe(42);
    });
  });

  describe('unwrapOr', () => {
    it('should return the value', () => {
      const ok = Ok(42);
      const value = ok.unwrapOr(0);

      expect(value).toBe(42);
    });

    it('should ignore default value', () => {
      const ok = Ok('present');
      const value = ok.unwrapOr('default');

      expect(value).toBe('present');
    });
  });

  describe('unwrapOrElse', () => {
    it('should return the value', () => {
      const ok = Ok(42);
      const value = ok.unwrapOrElse(() => 0);

      expect(value).toBe(42);
    });

    it('should not call fallback function', () => {
      let called = false;
      const ok = Ok(42);
      const value = ok.unwrapOrElse(() => {
        called = true;
        return 0;
      });

      expect(called).toBe(false);
      expect(value).toBe(42);
    });
  });
});

describe('Err', () => {
  it('should create Err instance with error', () => {
    const err = Err('error message');

    expect(err.ok).toBe(false);
    expect(err.error).toBe('error message');
    expect(err.value).toBeUndefined();
  });

  it('should create Err instance with number error', () => {
    const err = Err(404);

    expect(err.ok).toBe(false);
    expect(err.error).toBe(404);
  });

  it('should create Err instance with object error', () => {
    const err = Err({ code: 'NOT_FOUND', message: 'Not found' });

    expect(err.ok).toBe(false);
    expect(err.error).toEqual({ code: 'NOT_FOUND', message: 'Not found' });
  });

  describe('map', () => {
    it('should not transform value (no-op)', () => {
      const err = Err('error');
      const result = err.map((x) => x * 2);

      expect(isErr(result)).toBe(true);
      expect(result.error).toBe('error');
    });
  });

  describe('mapErr', () => {
    it('should transform error', () => {
      const err = Err('error');
      const mapped = err.mapErr((e) => `Error: ${e}`);

      expect(isErr(mapped)).toBe(true);
      expect(mapped.error).toBe('Error: error');
    });

    it('should change error type', () => {
      const err = Err(404);
      const mapped = err.mapErr((e) => ({ status: e }));

      expect(isErr(mapped)).toBe(true);
      expect(mapped.error).toEqual({ status: 404 });
    });

    it('should chain mapErr operations', () => {
      const err = Err('original');
      const result = err
        .mapErr((e) => `Step 1: ${e}`)
        .mapErr((e) => `Step 2: ${e}`)
        .mapErr((e) => `Step 3: ${e}`);

      expect(isErr(result)).toBe(true);
      expect(result.error).toBe('Step 3: Step 2: Step 1: original');
    });
  });

  describe('match', () => {
    it('should call err handler', () => {
      const err = Err('error');
      const result = err.match({
        ok: () => 'Success',
        err: (error) => `Error: ${error}`,
      });

      expect(result).toBe('Error: error');
    });
  });

  describe('unwrap', () => {
    it('should throw when unwrapping', () => {
      const err = Err('error');

      expect(() => err.unwrap()).toThrow('Cannot unwrap Err: error');
    });

    it('should throw with object error', () => {
      const err = Err({ code: 'TEST' });

      expect(() => err.unwrap()).toThrow('Cannot unwrap Err: [object Object]');
    });
  });

  describe('unwrapOr', () => {
    it('should return default value', () => {
      const err = Err('error');
      const value = err.unwrapOr(0);

      expect(value).toBe(0);
    });

    it('should return default for string error', () => {
      const err = Err('error');
      const value = err.unwrapOr('default');

      expect(value).toBe('default');
    });
  });

  describe('unwrapOrElse', () => {
    it('should call fallback function', () => {
      const err = Err('error');
      const value = err.unwrapOrElse(() => 42);

      expect(value).toBe(42);
    });

    it('should use error in fallback', () => {
      const err = Err('not found');
      const value = err.unwrapOrElse((e) => `Fallback: ${e}`);

      expect(value).toBe('Fallback: not found');
    });
  });
});

describe('Result', () => {
  it('should narrow to Ok', () => {
    const result: Result<number, string> = Ok(42);

    if (isOk(result)) {
      expect(result.value).toBe(42);
    }
  });

  it('should narrow to Err', () => {
    const result: Result<number, string> = Err('error');

    if (isErr(result)) {
      expect(result.error).toBe('error');
    }
  });
});

describe('isOk', () => {
  it('should return true for Ok', () => {
    const ok = Ok(42);
    expect(isOk(ok)).toBe(true);
  });

  it('should return false for Err', () => {
    const err = Err('error');
    expect(isOk(err)).toBe(false);
  });

  it('should return false for non-Result', () => {
    expect(isOk(null)).toBe(false);
    expect(isOk(undefined)).toBe(false);
    expect(isOk({})).toBe(false);
    expect(isOk({ ok: true })).toBe(false);
  });
});

describe('isErr', () => {
  it('should return true for Err', () => {
    const err = Err('error');
    expect(isErr(err)).toBe(true);
  });

  it('should return false for Ok', () => {
    const ok = Ok(42);
    expect(isErr(ok)).toBe(false);
  });

  it('should return false for non-Result', () => {
    expect(isErr(null)).toBe(false);
    expect(isErr(undefined)).toBe(false);
    expect(isErr({})).toBe(false);
    expect(isErr({ ok: false })).toBe(false);
  });
});
