import AjvSchemeValidator from '@/infrastructure/scheme-validator/AjvSchemeValidator';
import { JSONSchemaType } from 'ajv';
import { describe, expect, it } from 'vitest';

describe('AjvSchemeValidator', () => {
  const sut = new AjvSchemeValidator();

  it('should validate a correct object', () => {
    const schema: JSONSchemaType<{ name: string; age: number }> = {
      type: 'object',
      properties: {
        name: { type: 'string' },
        age: { type: 'number' },
      },
      required: ['name', 'age'],
      additionalProperties: false,
    };

    const validObject = { name: 'John', age: 30 };
    expect(sut.validate(validObject, schema)).toBe(true);
  });

  it('should invalidate an incorrect object', () => {
    const schema: JSONSchemaType<{ name: string; age: number }> = {
      type: 'object',
      properties: {
        name: { type: 'string' },
        age: { type: 'number' },
      },
      required: ['name', 'age'],
      additionalProperties: false,
    };

    const invalidObject = { name: 'John' };
    expect(sut.validate(invalidObject, schema)).toBe(false);
  });
});
