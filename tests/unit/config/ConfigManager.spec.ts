import ConfigManager from '@/config/ConfigManager';
import { Source } from '@/config/Source';
import fs from 'fs/promises';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const mockConfigFilePath = 'path/to/file';

const sut = new ConfigManager({ sources: [{ name: 'env', type: 'env' }] });

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

  describe('constructor', () => {
    it('should throw an error if no source is provided', () => {
      expect(() => new ConfigManager({ sources: [] })).toThrowError(
        'Config Error: No sources specified',
      );
    });

    it('should throw an error if a file source does not have a path', () => {
      const invalidSources: Array<Source> = [
        { name: 'Missing Path Source', type: 'file' },
      ];

      expect(() => new ConfigManager({ sources: invalidSources })).toThrowError(
        'Source of type "file" must have a "path": Missing Path Source',
      );
    });
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
    it('should return the config immediately if already loaded', async () => {
      const sut = new ConfigManager({
        sources: [{ name: 'file', type: 'file', path: 'path/to/file' }],
      });

      await sut.loadConfig();
      expect(fs.readFile).toHaveBeenCalled();
      await sut.loadConfig();
      expect(fs.readFile).toHaveBeenCalledTimes(1);
    });

    it('should merge file and environment configurations', async () => {
      vi.mocked(fs.readFile).mockResolvedValueOnce(mockFileContent);
      process.env.COMMIT_GEN_CONFIG_OPENAI_KEY = 'env_openai_key';

      const sut = new ConfigManager({
        sources: [
          { name: 'file', type: 'file', path: 'path/to/file' },
          { name: 'env', type: 'env' },
        ],
      });

      const result = await sut.loadConfig();

      expect(result).toEqual({
        openaiKey: 'env_openai_key',
        excludeFiles: ['node_modules', '.git'],
      });
    });
  });

  it('should throw an error for unsupported source types', async () => {
    const sut = new ConfigManager({
      sources: [
        {
          name: 'Unsupported Source',
          type: 'arg',
        },
      ],
    });

    await expect(sut.loadConfig()).rejects.toThrow(
      'Config Error: Source of type "arg" is not supported',
    );
  });

  describe('saveConfig', () => {
    const sut = new ConfigManager({
      sources: [
        { name: 'file', type: 'file', path: 'path/to/file' },
        { name: 'env', type: 'env' },
      ],
    });

    it('should throw an error if no source with the given name exists', async () => {
      await expect(
        sut.saveConfig('openaiKey', 'value', 'invalid'),
      ).rejects.toThrow('Config Error: No source with name "invalid" found');
    });

    it('should throw an error if the source is not writable (not of type "file")', async () => {
      await expect(sut.saveConfig('openaiKey', 'value', 'env')).rejects.toThrow(
        'Config Error: The source "env" is not writable',
      );
    });

    it('should save a single value as a string', async () => {
      vi.mocked(fs.readFile).mockResolvedValueOnce(mockFileContent);

      await sut.saveConfig('openaiKey', 'new_openai_key', 'file');

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

      await sut.saveConfig('excludeFiles', 'src,dist', 'file');

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
        sut.saveConfig('openaiKey', 'new_openai_key', 'file'),
      ).rejects.toThrow('Permission denied');
    });
  });

  describe('removeConfig', () => {
    const sut = new ConfigManager({
      sources: [
        { name: 'file', type: 'file', path: 'path/to/file' },
        { name: 'env', type: 'env' },
      ],
    });

    it('should throw an error if no source with the given name exists', async () => {
      await expect(sut.removeConfig('openaiKey', 'invalid')).rejects.toThrow(
        'Config Error: No source with name "invalid" found',
      );
    });

    it('should throw an error if the source is not writable (not of type "file")', async () => {
      await expect(sut.removeConfig('openaiKey', 'env')).rejects.toThrow(
        'Config Error: The source "env" is not writable',
      );
    });

    it('should remove an existing configuration from the file', async () => {
      vi.mocked(fs.readFile).mockResolvedValueOnce(mockFileContent);

      await sut.removeConfig('excludeFiles', 'file');

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
