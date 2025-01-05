import ConfigManager from '@/config/ConfigManager';
import EnvConfigLoader from '@/config/EnvConfigLoader';
import FileConfigLoader from '@/config/FileConfigLoader';
import { Source } from '@/config/Source';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const mockConfigFilePath = 'path/to/file';

const sut = new ConfigManager({ sources: [{ name: 'env', type: 'env' }] });

const mockFileContent = {
  openaiKey: 'mock_openai_key',
  excludeFiles: ['node_modules', '.git'],
};

const mockFileConfigLoader = {
  load: vi.fn(),
  write: vi.fn(),
} as FileConfigLoader;

const mockEnvConfigLoader = {
  load: vi.fn(),
} as unknown as EnvConfigLoader;

describe('ConfigManager', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.mocked(mockFileConfigLoader.load).mockResolvedValue({
      ...mockFileContent,
    });
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

  describe('loadConfig', () => {
    it('should return the config immediately if already loaded', async () => {
      const sut = new ConfigManager({
        sources: [{ name: 'file', type: 'file', path: 'path/to/file' }],
        fileConfigLoader: mockFileConfigLoader,
      });

      await sut.loadConfig();
      expect(mockFileConfigLoader.load).toHaveBeenCalled();
      await sut.loadConfig();
      expect(mockFileConfigLoader.load).toHaveBeenCalledTimes(1);
    });

    it('should merge file and environment configurations', async () => {
      process.env.COMMIT_GEN_CONFIG_OPENAI_KEY = 'env_openai_key';

      const sut = new ConfigManager({
        sources: [
          { name: 'file', type: 'file', path: 'path/to/file' },
          { name: 'env', type: 'env' },
        ],
        fileConfigLoader: mockFileConfigLoader,
      });

      const result = await sut.loadConfig();

      expect(result).toEqual({
        openaiKey: 'env_openai_key',
        excludeFiles: ['node_modules', '.git'],
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
  });

  describe('get', () => {
    it('should return the value from config when isLoaded is true', async () => {
      const sut = new ConfigManager({
        sources: [
          { name: 'file', type: 'file', path: 'path/to/file' },
          { name: 'env', type: 'env' },
        ],
        fileConfigLoader: mockFileConfigLoader,
      });

      await sut.loadConfig();
      expect(mockFileConfigLoader.load).toHaveBeenCalled();
      expect(await sut.get('excludeFiles')).toEqual(['node_modules', '.git']);
      expect(mockFileConfigLoader.load).toHaveBeenCalledTimes(1);
    });

    it('should return undefined if the key is not found in config when isLoaded is true', async () => {
      const sut = new ConfigManager({
        sources: [
          { name: 'file', type: 'file', path: 'path/to/file' },
          { name: 'env', type: 'env' },
        ],
        fileConfigLoader: mockFileConfigLoader,
      });

      await sut.loadConfig();
      expect(mockFileConfigLoader.load).toHaveBeenCalled();
      const result = await sut.get('nonExistingKey');
      expect(result).toBeUndefined();
      expect(mockFileConfigLoader.load).toHaveBeenCalledTimes(1);
    });

    it('should return the value from the first matching source', async () => {
      const sut = new ConfigManager({
        sources: [
          { name: 'file', type: 'file', path: 'path/to/file' },
          { name: 'env', type: 'env' },
        ],
        fileConfigLoader: mockFileConfigLoader,
        envConfigLoader: mockEnvConfigLoader,
      });

      vi.mocked(mockEnvConfigLoader.load).mockResolvedValueOnce({
        openaiKey: 'key',
      });

      const result = await sut.get('openaiKey');
      expect(result).toBe('key');
      expect(mockFileConfigLoader.load).toHaveBeenCalledTimes(0);
    });

    it('should cache the result after loading a source', async () => {
      const sut = new ConfigManager({
        sources: [
          { name: 'file', type: 'file', path: 'path/to/file' },
          { name: 'env', type: 'env' },
        ],
        fileConfigLoader: mockFileConfigLoader,
        envConfigLoader: mockEnvConfigLoader,
      });

      vi.mocked(mockEnvConfigLoader.load).mockResolvedValueOnce({
        openaiKey: 'key',
      });

      await sut.get('openaiKey');
      expect(mockEnvConfigLoader.load).toHaveBeenCalled();
      expect(await sut.get('openaiKey')).toBe('key');
      expect(mockEnvConfigLoader.load).toHaveBeenCalledTimes(1);
    });

    it('should return undefined if the key is not found in any source', async () => {
      const result = await sut.get('nonExistingKey');
      expect(result).toBeUndefined();
    });
  });

  describe('set', () => {
    const sut = new ConfigManager({
      sources: [
        { name: 'file', type: 'file', path: 'path/to/file' },
        { name: 'env', type: 'env' },
      ],
      fileConfigLoader: mockFileConfigLoader,
    });

    it('should throw an error if no source with the given name exists', async () => {
      await expect(sut.set('openaiKey', 'value', 'invalid')).rejects.toThrow(
        'Config Error: No source with name "invalid" found',
      );
    });

    it('should throw an error if the source is not writable (not of type "file")', async () => {
      await expect(sut.set('openaiKey', 'value', 'env')).rejects.toThrow(
        'Config Error: The source "env" is not writable',
      );
    });

    it('should save a single value as a string', async () => {
      await sut.set('openaiKey', 'new_openai_key', 'file');

      expect(mockFileConfigLoader.write).toHaveBeenCalledWith(
        mockConfigFilePath,
        {
          openaiKey: 'new_openai_key',
          excludeFiles: ['node_modules', '.git'],
        },
      );
    });

    it('should save a comma-separated value as an array', async () => {
      await sut.set('excludeFiles', 'src,dist', 'file');

      expect(mockFileConfigLoader.write).toHaveBeenCalledWith(
        mockConfigFilePath,
        {
          openaiKey: 'mock_openai_key',
          excludeFiles: ['src', 'dist'],
        },
      );
    });

    it('should throw an error if saving fails', async () => {
      vi.mocked(mockFileConfigLoader.write).mockRejectedValueOnce(
        new Error('Permission denied'),
      );

      await expect(
        sut.set('openaiKey', 'new_openai_key', 'file'),
      ).rejects.toThrow('Permission denied');
    });
  });

  describe('unset', () => {
    const sut = new ConfigManager({
      sources: [
        { name: 'file', type: 'file', path: 'path/to/file' },
        { name: 'env', type: 'env' },
      ],
      fileConfigLoader: mockFileConfigLoader,
    });

    it('should throw an error if no source with the given name exists', async () => {
      await expect(sut.unset('openaiKey', 'invalid')).rejects.toThrow(
        'Config Error: No source with name "invalid" found',
      );
    });

    it('should throw an error if the source is not writable (not of type "file")', async () => {
      await expect(sut.unset('openaiKey', 'env')).rejects.toThrow(
        'Config Error: The source "env" is not writable',
      );
    });

    it('should remove an existing configuration from the file', async () => {
      await sut.unset('excludeFiles', 'file');

      expect(mockFileConfigLoader.load).toHaveBeenCalled();

      expect(mockFileConfigLoader.write).toHaveBeenCalledWith(
        mockConfigFilePath,
        {
          openaiKey: 'mock_openai_key',
        },
      );
    });
  });
});
