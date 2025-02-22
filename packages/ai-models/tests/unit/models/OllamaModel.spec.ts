import OllamaModel from '@/models/OllamaModel';
import { Ollama } from 'ollama';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('ollama', () => ({
  Ollama: vi.fn().mockImplementation(() => ({
    chat: vi.fn().mockResolvedValue({
      message: { content: 'Mocked response' },
    }),
  })),
}));

describe('OllamaModel', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  describe('constructor', () => {
    it('should validate parameters', () => {
      const validParameters = [
        {
          model: 'gemma2:2b',
        },
        {
          model: 'gemma2:2b',
          temperature: '0.8',
        },
        {
          model: 'gemma2:2b',
          temperature: '0.8',
          url: 'https://example.com/model',
        },
        {
          model: 'gemma2:2b',
          url: 'https://example.com/model',
        },
      ];

      const invalidParameters = [
        {},
        { temperature: '0.8' },
        { url: 'https://example.com' },
      ];

      validParameters.forEach((params) => {
        expect(() => new OllamaModel(params)).not.toThrow();
      });

      invalidParameters.forEach((params) => {
        expect(() => new OllamaModel(params)).toThrow();
      });
    });

    it('should create an instance of Ollama with the correct host', () => {
      new OllamaModel({
        model: 'gemma2:2b',
      });

      expect(Ollama).toHaveBeenCalledWith({ host: 'http://127.0.0.1:11434' });

      new OllamaModel({
        model: 'gemma2:2b',
        url: 'https://example',
      });

      expect(Ollama).toHaveBeenCalledWith({ host: 'https://example' });
    });
  });

  describe('complete', () => {
    it('should return a response without making a real request', async () => {
      const mockParams = {
        model: 'gemma2:2b',
        temperature: '0.7',
        url: 'http://127.0.0.1:11434',
      };

      const sut = new OllamaModel(mockParams);
      const response = await sut.complete('Test prompt');

      expect(response).toBe('Mocked response');
    });
  });
});
