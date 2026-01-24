import { describe, it, expect } from 'vitest';
import { Result, Ok, Err, ResultUtils } from '../../src/result.js';
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

      expect(() => err.unwrap()).toThrow('[OxogTypes] Cannot unwrap Err: "error"');
    });

    it('should throw with object error', () => {
      const err = Err({ code: 'TEST' });

      expect(() => err.unwrap()).toThrow('[OxogTypes] Cannot unwrap Err: {"code":"TEST"}');
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

describe('flatMap', () => {
  it('should chain Ok results', () => {
    const result = Ok(10)
      .flatMap((x) => Ok(x * 2))
      .flatMap((x) => Ok(x + 5));

    expect(isOk(result)).toBe(true);
    expect(result.value).toBe(25);
  });

  it('should short-circuit on Err', () => {
    const result = Ok(10)
      .flatMap((x) => (x > 5 ? Err('too big') : Ok(x)))
      .flatMap((x) => Ok(x * 2));

    expect(isErr(result)).toBe(true);
    expect(result.error).toBe('too big');
  });

  it('should not execute on Err', () => {
    let called = false;
    const result = Err('initial error').flatMap(() => {
      called = true;
      return Ok(42);
    });

    expect(called).toBe(false);
    expect(isErr(result)).toBe(true);
    expect(result.error).toBe('initial error');
  });

  it('should allow type transformation', () => {
    const parseNumber = (s: string): Result<number, string> => {
      const n = parseInt(s, 10);
      return isNaN(n) ? Err('not a number') : Ok(n);
    };

    const result = Ok('42').flatMap(parseNumber);
    expect(isOk(result)).toBe(true);
    expect(result.value).toBe(42);

    const invalid = Ok('abc').flatMap(parseNumber);
    expect(isErr(invalid)).toBe(true);
    expect(invalid.error).toBe('not a number');
  });
});

describe('safeStringify edge cases', () => {
  it('should handle circular references', () => {
    const circular: Record<string, unknown> = { name: 'test' };
    circular.self = circular;
    const err = Err(circular);

    expect(() => err.unwrap()).toThrow('[Circular]');
  });

  it('should handle BigInt', () => {
    const err = Err(BigInt(123456789));

    expect(() => err.unwrap()).toThrow('123456789');
  });

  it('should handle nested BigInt in objects', () => {
    const err = Err({ id: 1, bigValue: BigInt(999) });

    expect(() => err.unwrap()).toThrow('999');
  });

  it('should handle objects that throw on property access', () => {
    const problematic = {
      toJSON() {
        throw new Error('Cannot serialize');
      },
    };
    const err = Err(problematic);

    // Should fall back to String(value) in catch block
    expect(() => err.unwrap()).toThrow('[object Object]');
  });

  it('should handle Error objects', () => {
    const err = Err(new Error('Something went wrong'));

    expect(() => err.unwrap()).toThrow('Something went wrong');
  });

  it('should handle Symbol', () => {
    const err = Err(Symbol('test'));

    expect(() => err.unwrap()).toThrow('Symbol(test)');
  });

  it('should handle functions', () => {
    const err = Err(() => 'test');

    expect(() => err.unwrap()).toThrow('[Function]');
  });
});

describe('ResultUtils', () => {
  describe('tryCatch', () => {
    it('should return Ok for successful function', () => {
      const result = ResultUtils.tryCatch(() => JSON.parse('{"a": 1}'));

      expect(isOk(result)).toBe(true);
      expect(result.value).toEqual({ a: 1 });
    });

    it('should return Err for throwing function', () => {
      const result = ResultUtils.tryCatch(() => JSON.parse('invalid'));

      expect(isErr(result)).toBe(true);
      expect(result.error).toBeInstanceOf(Error);
    });

    it('should wrap non-Error throws in Error', () => {
      const result = ResultUtils.tryCatch(() => {
        throw 'string error';
      });

      expect(isErr(result)).toBe(true);
      expect(result.error).toBeInstanceOf(Error);
      expect(result.error.message).toBe('string error');
    });
  });

  describe('fromPromise', () => {
    it('should return Ok for resolved promise', async () => {
      const result = await ResultUtils.fromPromise(Promise.resolve(42));

      expect(isOk(result)).toBe(true);
      expect(result.value).toBe(42);
    });

    it('should return Err for rejected promise', async () => {
      const result = await ResultUtils.fromPromise(
        Promise.reject(new Error('failed'))
      );

      expect(isErr(result)).toBe(true);
      expect(result.error).toBeInstanceOf(Error);
      expect(result.error.message).toBe('failed');
    });

    it('should wrap non-Error rejections in Error', async () => {
      const result = await ResultUtils.fromPromise(Promise.reject('string error'));

      expect(isErr(result)).toBe(true);
      expect(result.error).toBeInstanceOf(Error);
      expect(result.error.message).toBe('string error');
    });
  });

  describe('all', () => {
    it('should combine all Ok results', () => {
      const result = ResultUtils.all([Ok(1), Ok(2), Ok(3)]);

      expect(isOk(result)).toBe(true);
      expect(result.value).toEqual([1, 2, 3]);
    });

    it('should return first Err', () => {
      const result = ResultUtils.all([Ok(1), Err('first'), Err('second')]);

      expect(isErr(result)).toBe(true);
      expect(result.error).toBe('first');
    });

    it('should return Ok for empty array', () => {
      const result = ResultUtils.all([]);

      expect(isOk(result)).toBe(true);
      expect(result.value).toEqual([]);
    });

    it('should work with mixed types', () => {
      const results: Result<number | string, string>[] = [
        Ok(1),
        Ok('two'),
        Ok(3),
      ];
      const result = ResultUtils.all(results);

      expect(isOk(result)).toBe(true);
      expect(result.value).toEqual([1, 'two', 3]);
    });
  });
});
