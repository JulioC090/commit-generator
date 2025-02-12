import { IAIModelParams } from '@/application/interfaces/IAIModel';
import AIModel from '@/infrastructure/ai/AIModel';
import { JSONSchemaType } from 'ajv';
import { describe, expect, it } from 'vitest';

class TestModel extends AIModel<IAIModelParams> {
  constructor(parameters: IAIModelParams, schema: unknown) {
    super(parameters, schema);
  }
}

describe('AIModel', () => {
  const schema: JSONSchemaType<{ temperature: number; maxTokens: number }> = {
    type: 'object',
    properties: {
      temperature: { type: 'number', minimum: 0, maximum: 1 },
      maxTokens: { type: 'number', minimum: 1 },
    },
    required: ['temperature', 'maxTokens'],
    additionalProperties: false,
  };

  it('should create an AIModel with valid parameters', () => {
    const validParams = { temperature: 0.7, maxTokens: 100 };
    expect(() => new TestModel(validParams, schema)).not.toThrow();
  });

  it('should throw an error for invalid parameters', () => {
    const invalidParams = { temperature: 1.5, maxTokens: -10 };
    expect(() => new TestModel(invalidParams, schema)).toThrow();
  });
});
