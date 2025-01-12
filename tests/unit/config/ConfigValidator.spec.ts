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

    it('should validate array<string> correctly', () => {
      const config = {
        tags: ['tag1', 'tag2'],
      };

      const wrongConfig = {
        tags: ['tag1', 123],
      };

      const sut = new ConfigValidator({
        definitions: {
          tags: { required: false, type: 'array<string>' },
        },
      });

      expect(sut.validate(config).valid).toBe(true);
      expect(sut.validate(wrongConfig).valid).toBe(false);
    });

    it('should validate array<string|number> correctly', () => {
      const config = {
        values: ['value1', 42, 'value3'],
      };

      const wrongConfig = {
        values: ['value1', {}, 'value3'],
      };

      const sut = new ConfigValidator({
        definitions: {
          values: { required: false, type: 'array<string|number>' },
        },
      });

      expect(sut.validate(config).valid).toBe(true);
      expect(sut.validate(wrongConfig).valid).toBe(false);
    });

    it('should validate string|array<string> correctly', () => {
      const config1 = {
        mixed: 'simple string',
      };
      const config2 = {
        mixed: ['string1', 'string2'],
      };

      const wrongConfig = {
        mixed: [123, 'string'],
      };

      const sut = new ConfigValidator({
        definitions: {
          mixed: { required: false, type: 'string|array<string>' },
        },
      });

      expect(sut.validate(config1).valid).toBe(true);
      expect(sut.validate(config2).valid).toBe(true);
      expect(sut.validate(wrongConfig).valid).toBe(false);
    });

    it('should validate array<number>|number correctly', () => {
      const config1 = {
        numberArrayOrSingle: 42,
      };
      const config2 = {
        numberArrayOrSingle: [1, 2, 3],
      };

      const wrongConfig = {
        numberArrayOrSingle: ['string', 42],
      };

      const sut = new ConfigValidator({
        definitions: {
          numberArrayOrSingle: {
            required: false,
            type: 'array<number>|number',
          },
        },
      });

      expect(sut.validate(config1).valid).toBe(true);
      expect(sut.validate(config2).valid).toBe(true);
      expect(sut.validate(wrongConfig).valid).toBe(false);
    });

    it('should validate string|array<string>|number|array<number> correctly', () => {
      const config1 = {
        complexType: 'string',
      };
      const config2 = {
        complexType: ['string1', 'string2'],
      };
      const config3 = {
        complexType: 42,
      };
      const config4 = {
        complexType: [1, 2, 3],
      };

      const wrongConfig = {
        complexType: [1, 'string'],
      };

      const sut = new ConfigValidator({
        definitions: {
          complexType: {
            required: false,
            type: 'string|array<string>|number|array<number>',
          },
        },
      });

      expect(sut.validate(config1).valid).toBe(true);
      expect(sut.validate(config2).valid).toBe(true);
      expect(sut.validate(config3).valid).toBe(true);
      expect(sut.validate(config4).valid).toBe(true);
      expect(sut.validate(wrongConfig).valid).toBe(false);
    });

    it('should throw an error if non-array value is provided for array<> type', () => {
      const config = {
        emptyArrayType: [],
      };

      const sut = new ConfigValidator({
        definitions: {
          emptyArrayType: { required: false, type: 'array<>' },
        },
      });

      expect(() => sut.validate(config)).throws('Invalid array type');
    });
  });
});
