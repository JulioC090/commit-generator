import keyValueParser from '@/parsers/keyValueParser';
import { InvalidArgumentError } from '@commander-js/extra-typings';
import { describe, expect, it } from 'vitest';

describe('keyValueParser', () => {
  it('should parse a valid key-value pair', () => {
    const result = keyValueParser('foo=bar', []);
    expect(result).toEqual([{ key: 'foo', value: 'bar' }]);
  });

  it('should parse multiple key-value pairs', () => {
    const result = keyValueParser('key1=value1', [
      { key: 'key2', value: 'value2' },
    ]);
    expect(result).toEqual([
      { key: 'key2', value: 'value2' },
      { key: 'key1', value: 'value1' },
    ]);
  });

  it('should throw an error for invalid key-value pairs', () => {
    expect(() => keyValueParser('invalidPair', [])).toThrowError(
      'Invalid key-value pair format. Expected "key=value".',
    );
  });

  it('should throw an error when key or value is missing', () => {
    expect(() => keyValueParser('keyOnly=', [])).toThrowError(
      new InvalidArgumentError(
        'Invalid key-value pair format. Expected "key=value".',
      ),
    );
    expect(() => keyValueParser('=valueOnly', [])).toThrowError(
      new InvalidArgumentError(
        'Invalid key-value pair format. Expected "key=value".',
      ),
    );
  });

  it('should initialize an empty array if pairs is undefined', () => {
    const result = keyValueParser('test=value', undefined);
    expect(result).toEqual([{ key: 'test', value: 'value' }]);
  });
});
