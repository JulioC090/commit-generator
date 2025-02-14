import EnvConfigLoader from '@/loaders/EnvConfigLoader';
import { describe, expect, it } from 'vitest';

describe('EnvConfigLoader', async () => {
  describe('constructor', () => {
    it('should parse arguments from process.env correctly', async () => {
      const originalEnv = process.env;
      process.env = { OPENAI_KEY: 'env_openai_key' };

      const sut = new EnvConfigLoader();
      const config = await sut.load({ name: 'env-source', type: 'env' });

      expect(config).toEqual({ openai: { key: 'env_openai_key' } });

      process.env = originalEnv;
    });
  });

  describe('validate', () => {
    it('should validate', async () => {
      const sut = new EnvConfigLoader();
      await sut.validate();
    });
  });

  describe('load', async () => {
    it('should load variables with the correct prefix', async () => {
      const sut = new EnvConfigLoader({
        env: {
          COMMIT_GEN_CONFIG_OPENAI_KEY: 'env_openai_key',
          COMMIT_GEN_CONFIG_EXCLUDE_FILES: 'env_file1,env_file2',
        },
      });

      const result = await sut.load({
        name: 'env-source',
        type: 'env',
        prefix: 'commit_gen_config_',
      });

      expect(result).toEqual({
        openai: { key: 'env_openai_key' },
        exclude: { files: ['env_file1', 'env_file2'] },
      });
    });

    it('should load all variables when no prefix is set', async () => {
      const mockEnv = {
        commit_gen_config_openaiKey: 'openai-key-value',
        commit_gen_config_excludeFiles: 'node_modules,.git',
        APPSECRET: 'supersecretvalue',
      };

      const sut = new EnvConfigLoader({ env: mockEnv });

      const result = (await sut.load({ name: 'env-source', type: 'env' })) as {
        [key: string]: unknown;
      };

      expect(result.openaiKey).toBeUndefined();
      expect(result.appsecret).toBe('supersecretvalue');
    });

    it('should ignore irrelevant environment variables', async () => {
      const sut = new EnvConfigLoader({
        env: { UNRELATED_ENV_VAR: 'value' },
      });

      const result = await sut.load({
        name: 'env-source',
        type: 'env',
        prefix: 'commit_gen_config_',
      });

      expect(result).toEqual({});
    });

    it('should format the env variable keys using dots to represent object properties', async () => {
      const sut = new EnvConfigLoader({
        env: { OPENAI_KEY: 'openai-key-value' },
      });

      const result = (await sut.load({ name: 'env-source', type: 'env' })) as {
        openai: { key: string };
      };

      expect(result.openai.key).toBe('openai-key-value');
    });

    it('should skip empty env variables with prefix', async () => {
      const mockEnv = {
        commit_gen_config_emptyKey: '',
      };

      const sut = new EnvConfigLoader({
        env: mockEnv,
      });
      const result = (await sut.load({
        name: 'env-source',
        type: 'env',
        prefix: 'commit_gen_config_',
      })) as {
        [key: string]: unknown;
      };

      expect(result.emptyKey).toBeUndefined();
    });
  });
});
