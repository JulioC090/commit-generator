import ConfigValidator from '@/config/ConfigValidator';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const mockDefinitions = {
  openaiKey: { required: true },
  excludeFiles: { required: false },
};

describe('ConfigValidator', () => {
  let sut: ConfigValidator;

  beforeEach(() => {
    sut = new ConfigValidator({ definitions: mockDefinitions });

    vi.resetAllMocks();
  });

  describe('validate', () => {
    it('should return valid when all required fields are present', () => {
      const config = {
        openaiKey: 'openai_key',
        excludeFiles: ['pnpm-lock.yaml'],
      };

      const result = sut.validate(config);

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should return an error when a required field is missing', () => {
      const config = { excludeFiles: ['pnpm-lock.yaml'] };

      const result = sut.validate(config);

      expect(result.valid).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0]).toEqual({
        key: 'openaiKey',
        error: 'Missing',
        message: 'The "openaiKey" property is required',
      });
    });

    it('should return valid when non-required fields are missing', () => {
      const config = { openaiKey: 'openai_key' };

      const result = sut.validate(config);

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
  });
});
