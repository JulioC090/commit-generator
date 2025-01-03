import ConfigManager from '@/config/ConfigManager';
import fs from 'fs/promises';
import path from 'node:path';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const mockConfigFilePath = path.join(__dirname, '../../../.commitgen.json');

const sut = new ConfigManager();

const mockFileContent = JSON.stringify(
  {
    openaiKey: 'mock_openai_key',
    excludeFiles: ['node_modules', '.git'],
  },
  null,
  2,
);

vi.mock('fs/promises');

describe('ConfigManager', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe('loadConfigFile', () => {
    it('should load an existing config file', async () => {
      vi.mocked(fs.readFile).mockResolvedValueOnce(mockFileContent);

      const result = await sut.loadConfigFile(mockConfigFilePath);

      expect(fs.readFile).toHaveBeenCalledWith(mockConfigFilePath, {
        encoding: 'utf8',
      });
      expect(result).toEqual(JSON.parse(mockFileContent));
    });

    it('should return an empty object if the file does not exist', async () => {
      vi.mocked(fs.readFile).mockRejectedValueOnce(new Error('File not found'));

      const result = await sut.loadConfigFile(mockConfigFilePath);

      expect(result).toEqual({});
    });
  });

  describe('loadEnvConfig', () => {
    it('should load configuration from environment variables', async () => {
      process.env = {
        COMMIT_GEN_CONFIG_OPENAI_KEY: 'env_openai_key',
        COMMIT_GEN_CONFIG_EXCLUDE_FILES: 'env_file1,env_file2',
      };

      const result = await sut.loadEnvConfig();

      expect(result).toEqual({
        openaiKey: 'env_openai_key',
        excludeFiles: ['env_file1', 'env_file2'],
      });
    });

    it('should ignore irrelevant environment variables', async () => {
      process.env = {
        UNRELATED_ENV_VAR: 'value',
      };

      const result = await sut.loadEnvConfig();

      expect(result).toEqual({});
    });
  });

  describe('loadConfig', () => {
    it('should merge file and environment configurations', async () => {
      vi.mocked(fs.readFile).mockResolvedValueOnce(mockFileContent);
      process.env.COMMIT_GEN_CONFIG_OPENAI_KEY = 'env_openai_key';

      const result = await sut.loadConfig();

      expect(result).toEqual({
        openaiKey: 'env_openai_key',
        excludeFiles: ['node_modules', '.git'],
      });
    });
  });

  describe('saveConfig', () => {
    it('should save a single value as a string', async () => {
      vi.mocked(fs.readFile).mockResolvedValueOnce(mockFileContent);

      await sut.saveConfig('openaiKey', 'new_openai_key');

      expect(fs.writeFile).toHaveBeenCalledWith(
        mockConfigFilePath,
        JSON.stringify(
          {
            openaiKey: 'new_openai_key',
            excludeFiles: ['node_modules', '.git'],
          },
          null,
          2,
        ),
      );
    });

    it('should save a comma-separated value as an array', async () => {
      vi.mocked(fs.readFile).mockResolvedValueOnce(mockFileContent);

      await sut.saveConfig('excludeFiles', 'src,dist');

      expect(fs.writeFile).toHaveBeenCalledWith(
        mockConfigFilePath,
        JSON.stringify(
          {
            openaiKey: 'mock_openai_key',
            excludeFiles: ['src', 'dist'],
          },
          null,
          2,
        ),
      );
    });

    it('should throw an error if saving fails', async () => {
      vi.mocked(fs.readFile).mockResolvedValueOnce(mockFileContent);
      vi.mocked(fs.writeFile).mockRejectedValueOnce(
        new Error('Permission denied'),
      );

      await expect(
        sut.saveConfig('openaiKey', 'new_openai_key'),
      ).rejects.toThrow('Permission denied');
    });
  });

  describe('removeConfig', () => {
    it('should remove an existing configuration from the file', async () => {
      vi.mocked(fs.readFile).mockResolvedValueOnce(mockFileContent);

      await sut.removeConfig('excludeFiles');

      expect(fs.writeFile).toHaveBeenCalledWith(
        mockConfigFilePath,
        JSON.stringify(
          {
            openaiKey: 'mock_openai_key',
          },
          null,
          2,
        ),
      );
    });
  });
});
