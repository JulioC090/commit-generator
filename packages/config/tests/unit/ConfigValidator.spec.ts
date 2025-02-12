import ConfigValidator from '@/ConfigValidator';
import { JSONSchemaType } from 'ajv';
import { describe, expect, it } from 'vitest';

interface MyConfig {
  port: number;
  debug: boolean;
  name: string;
  job: {
    title: string;
  };
}

const schema: JSONSchemaType<MyConfig> = {
  type: 'object',
  properties: {
    port: { type: 'integer' },
    debug: { type: 'boolean' },
    name: { type: 'string' },
    job: {
      type: 'object',
      properties: {
        title: { type: 'string' },
      },
      required: ['title'],
    },
  },
  required: ['port', 'debug', 'name'],
  additionalProperties: false,
};

describe('ConfigValidator', () => {
  const sut = new ConfigValidator({ definitions: schema });

  describe('validate', () => {
    it('should validate a correct config object', () => {
      const config = { port: 8080, debug: true, name: 'MyApp' };
      const result = sut.validate(config);
      expect(result).toEqual({ valid: true, errors: [] });
    });

    it('should return an error when validating an object with invalid values', () => {
      const config = { port: 'wrong', debug: true, name: 'MyApp' };
      const result = sut.validate(config);
      expect(result.valid).toBe(false);
      expect(result.errors).toBeInstanceOf(Array);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('should return an error when validating an object with missing properties', () => {
      const config = { port: 8080, debug: true };
      const result = sut.validate(config);
      expect(result.valid).toBe(false);
      expect(result.errors).toBeInstanceOf(Array);
      expect(result.errors.length).toBeGreaterThan(0);
    });
  });

  describe('validateKey', () => {
    it('should validate a correct key-value pair', () => {
      expect(sut.validateKey('port', 3000)).toEqual({
        valid: true,
        errors: [],
      });
      expect(sut.validateKey('debug', false)).toEqual({
        valid: true,
        errors: [],
      });
      expect(sut.validateKey('name', 'TestApp')).toEqual({
        valid: true,
        errors: [],
      });
      expect(sut.validateKey('job.title', 'TestApp')).toEqual({
        valid: true,
        errors: [],
      });
    });

    it('should return an error when validating an invalid key-value pair', () => {
      expect(sut.validateKey('port', 'wrong')).toMatchObject({ valid: false });
      expect(sut.validateKey('debug', 'true')).toMatchObject({ valid: false });
      expect(sut.validateKey('name', 123)).toMatchObject({ valid: false });
      expect(sut.validateKey('job', {})).toMatchObject({ valid: false });
    });

    it('should throw an error when trying to validate a non-existent key', () => {
      expect(() => sut.validateKey('nonexistent', 'value')).toThrow(
        'The key "nonexistent" is not defined in the schema.',
      );

      expect(() => sut.validateKey('nonexistent.nonexistent', 'value')).toThrow(
        'The key "nonexistent.nonexistent" is not defined in the schema.',
      );
    });
  });
});
