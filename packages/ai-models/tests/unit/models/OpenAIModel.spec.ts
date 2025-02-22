import OpenAIModel from '@/models/OpenAIModel';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('openai', () => ({
  default: vi.fn().mockImplementation(() => ({
    chat: {
      completions: {
        create: vi.fn().mockResolvedValue({
          choices: [{ message: { content: 'Mocked response' } }],
        }),
      },
    },
  })),
}));

describe('OpenAIModel', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  describe('constructor', () => {
    it('should validate parameters', () => {
      const validParameters = [
        {
          key: 'my-key',
        },
        {
          key: 'my-key',
          model: 'gpt-4o-mini',
        },
      ];

      const invalidParameters = [{}];

      validParameters.forEach((params) => {
        expect(() => new OpenAIModel(params)).not.toThrow();
      });

      invalidParameters.forEach((params) => {
        expect(() => new OpenAIModel(params)).toThrow();
      });
    });
  });

  describe('complete', () => {
    it('should return a response without making a real request', async () => {
      const mockParams = {
        key: 'my-key',
      };

      const sut = new OpenAIModel(mockParams);
      const response = await sut.complete('Test prompt');

      expect(response).toBe('Mocked response');
    });
  });
});
