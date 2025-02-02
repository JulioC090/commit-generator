import formatConfigValue from '@/formatConfigValue';
import { describe, expect, it } from 'vitest';

describe('formatConfigValue', () => {
  it('should return an array when value contains a comma', () => {
    expect(formatConfigValue('a,b,c')).toEqual(['a', 'b', 'c']);
  });

  it('should return the original string when no comma is present', () => {
    expect(formatConfigValue('abc')).toBe('abc');
  });

  it('should handle empty string', () => {
    expect(formatConfigValue('')).toBe('');
  });

  it('should handle single character string without comma', () => {
    expect(formatConfigValue('a')).toBe('a');
  });

  it('should handle string with only commas', () => {
    expect(formatConfigValue(',,,')).toEqual(['', '', '', '']);
  });

  it('should handle leading and trailing commas', () => {
    expect(formatConfigValue(',a,b,')).toEqual(['', 'a', 'b', '']);
  });
});
