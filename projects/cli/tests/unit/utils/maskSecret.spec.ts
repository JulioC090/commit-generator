import maskSecret from '@/utils/maskSecret';
import { describe, expect, it } from 'vitest';

describe('maskSecret', () => {
  it('should mask a long secret while keeping the start and end visible', () => {
    expect(maskSecret('sk-12345678-ABCD')).toBe('sk-1...ABCD');
  });

  it('should fully mask secrets shorter than the visible range', () => {
    expect(maskSecret('abcdef')).toBe('******');
    expect(maskSecret('xyz')).toBe('***');
  });

  it('should work with custom visibleStart and visibleEnd values', () => {
    expect(maskSecret('sk-12345678-ABCD', 2, 2)).toBe('sk...CD');
    expect(maskSecret('sk-12345678-ABCD', 6, 6)).toBe('sk-123...8-ABCD');
  });

  it('should handle empty strings correctly', () => {
    expect(maskSecret('')).toBe('');
  });

  it('should handle secrets with exactly visibleStart + visibleEnd length', () => {
    expect(maskSecret('12345678', 4, 4)).toBe('********');
  });
});
