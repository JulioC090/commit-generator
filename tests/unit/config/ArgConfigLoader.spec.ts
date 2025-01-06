import ArgConfigLoader from '@/config/ArgConfigLoader';
import { describe, expect, it } from 'vitest';

describe('ArgConfigLoader', () => {
  describe('constructor', () => {
    it('should parse arguments from process.argv correctly', async () => {
      const originalArgv = process.argv;
      process.argv = ['node', 'script.js', '--openaiKey=arg_openai_key'];

      const sut = new ArgConfigLoader();
      const config = await sut.load();

      expect(config).toEqual({ openaiKey: 'arg_openai_key' });

      process.argv = originalArgv;
    });
  });

  describe('load', () => {
    it('should parse single argument correctly', async () => {
      const args = ['--openaiKey=arg_openai_key'];
      const sut = new ArgConfigLoader({ arg: args });

      const config = await sut.load();
      expect(config).toEqual({ openaiKey: 'arg_openai_key' });
    });

    it('should parse multiple arguments correctly', async () => {
      const args = ['--openaiKey=arg_openai_key', '--otherKey=12345,12345'];
      const sut = new ArgConfigLoader({ arg: args });

      const config = await sut.load();
      expect(config).toEqual({
        openaiKey: 'arg_openai_key',
        otherKey: ['12345', '12345'],
      });
    });

    it('should return an empty object when no arguments match', async () => {
      const args = ['randomArg', 'anotherArg'];
      const sut = new ArgConfigLoader({ arg: args });

      const config = await sut.load();
      expect(config).toEqual({});
    });

    it('should ignore malformed arguments', async () => {
      const args = [
        '--openaiKey=arg_openai_key',
        'malformedArg',
        '--validKey=value',
      ];
      const loader = new ArgConfigLoader({ arg: args });

      const config = await loader.load();
      expect(config).toEqual({
        openaiKey: 'arg_openai_key',
        validKey: 'value',
      });
    });
  });
});
