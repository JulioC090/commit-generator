import { createKeyValueArray } from '@/utils/createKeyValueArray';
import { describe, expect, it } from 'vitest';

describe('createKeyValueArray', () => {
  it('should correctly create an array of key-value pairs', () => {
    const input = ['key1=value1', 'key2=value2'];
    const result = createKeyValueArray(input);

    expect(result).toEqual([
      { key: 'key1', value: 'value1' },
      { key: 'key2', value: 'value2' },
    ]);
  });

  it('should ignore invalid key-value pairs', () => {
    const input = ['key1=value1', 'invalidPair', 'key2=value2'];
    const result = createKeyValueArray(input);

    expect(result).toEqual([
      { key: 'key1', value: 'value1' },
      { key: 'key2', value: 'value2' },
    ]);
  });

  it('should return an empty array when no valid key-value pairs are provided', () => {
    const input = ['invalidPair', 'anotherInvalidPair'];
    const result = createKeyValueArray(input);

    expect(result).toEqual([]);
  });

  it('should return an empty array when the input is empty', () => {
    const input: string[] = [];
    const result = createKeyValueArray(input);

    expect(result).toEqual([]);
  });
});
