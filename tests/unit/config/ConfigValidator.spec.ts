import { ConfigDefinitions } from '@/config/ConfigDefinitions';
import ConfigValidator from '@/config/ConfigValidator';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const mockDefinitions: ConfigDefinitions = {
  username: { required: true, type: 'string' },
  age: { required: false, type: 'number' },
  isWorking: { required: false, type: 'boolean' },
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
        username: 'john_doe',
        age: 30,
      };

      const result = sut.validate(config);

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should return an error when a required field is missing', () => {
      const config = { age: 30 };

      const result = sut.validate(config);

      expect(result.valid).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0]).toEqual({
        key: 'username',
        error: 'Missing',
        message: 'The "username" property is required',
      });
    });

    it('should return valid when non-required fields are missing', () => {
      const config = { username: 'john_doe' };

      const result = sut.validate(config);

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should validate config with all correct types and required fields', () => {
      const config = {
        username: 'john_doe',
        age: 30,
        isWorking: true,
      };

      const result = sut.validate(config);

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should return an error when a field has the wrong type', () => {
      const config = {
        username: 'john_doe',
        age: 'thirty',
        email: 'john.doe@example.com',
      };

      const result = sut.validate(config);

      expect(result.valid).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0].key).toBe('age');
      expect(result.errors[0].error).toBe('WrongType');
    });

    it('should return true for matching multiple types (string|number)', () => {
      const sut = new ConfigValidator({
        definitions: {
          multiValue: { required: false, type: 'string|boolean' },
        },
      });

      expect(
        sut.validate({
          multiValue: 'test',
        }).valid,
      ).toBe(true);

      expect(
        sut.validate({
          multiValue: true,
        }).valid,
      ).toBe(true);
    });

    it('should return false for incorrect types when using multiple types', () => {
      const sut = new ConfigValidator({
        definitions: {
          multiValue: { required: false, type: 'number|boolean' },
        },
      });

      expect(
        sut.validate({
          multiValue: 'test',
        }).valid,
      ).toBe(false);
    });
  });
});
