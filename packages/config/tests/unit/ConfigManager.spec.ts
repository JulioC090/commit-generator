import ConfigManager from '@/ConfigManager';
import ConfigSourceManager from '@/ConfigSourceManager';
import ConfigValidator from '@/ConfigValidator';
import { ISource } from '@/types/ISource';
import { ErrorObject } from 'ajv';
import { beforeEach, describe, expect, it, vi } from 'vitest';

interface MyConfig {
  openai: { key: string };
  excludeFiles: Array<string>;
}

const mockFileContent = {
  openai: { key: 'mock_openai_key' },
  excludeFiles: ['node_modules', '.git'],
};

const mockSources: Array<ISource> = [
  { name: 'file', type: 'file', path: 'path/to/file' },
  { name: 'env', type: 'env' },
];

const mockConfigSourceManager = {
  getSources: vi.fn(),
  load: vi.fn(),
  write: vi.fn(),
} as unknown as ConfigSourceManager;

const mockConfigValidator = {
  validate: vi.fn(),
  validateKey: vi.fn(),
} as unknown as ConfigValidator<MyConfig>;

describe('ConfigManager', () => {
  let sut: ConfigManager<MyConfig>;

  beforeEach(() => {
    vi.resetAllMocks();

    sut = new ConfigManager({
      configSourceManager: mockConfigSourceManager,
      configValidator: mockConfigValidator,
    });
    vi.mocked(mockConfigSourceManager.getSources).mockReturnValue(mockSources);
    vi.mocked(mockConfigValidator.validate).mockReturnValue({
      valid: true,
      errors: [],
    });
    vi.mocked(mockConfigValidator.validateKey).mockReturnValue({
      valid: true,
      errors: [],
    });
  });

  describe('loadConfig', () => {
    it('should return the config immediately if already loaded', async () => {
      await sut.loadConfig();
      expect(mockConfigSourceManager.getSources).toHaveBeenCalled();
      await sut.loadConfig();
      expect(mockConfigSourceManager.getSources).toHaveBeenCalledTimes(1);
    });

    it('should merge file and environment configurations', async () => {
      vi.mocked(mockConfigSourceManager.load).mockResolvedValueOnce(
        mockFileContent,
      );
      vi.mocked(mockConfigSourceManager.load).mockResolvedValueOnce({
        openai: { key: 'env_openai_key' },
      });

      const result = await sut.loadConfig();

      expect(result).toEqual({
        openai: { key: 'env_openai_key' },
        excludeFiles: ['node_modules', '.git'],
      });
    });

    it('should not log errors when the config is valid', async () => {
      const consoleErrorSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      await sut.loadConfig();

      expect(consoleErrorSpy).not.toHaveBeenCalled();

      consoleErrorSpy.mockRestore();
    });

    it('should log errors when the config is invalid', async () => {
      vi.mocked(mockConfigValidator.validate).mockReturnValueOnce({
        valid: false,
        errors: [
          { keyword: 'someKey', message: 'Missing somekey' } as ErrorObject,
        ],
      });

      const consoleErrorSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      await sut.loadConfig();

      expect(consoleErrorSpy).toHaveBeenCalled();

      consoleErrorSpy.mockRestore();
    });
  });

  describe('get', () => {
    it('should return the value from config when isLoaded is true', async () => {
      vi.mocked(mockConfigSourceManager.load).mockResolvedValueOnce({
        ...mockFileContent,
      });
      vi.mocked(mockConfigSourceManager.load).mockResolvedValueOnce({
        openai: { key: 'env_openai_key' },
      });

      await sut.loadConfig();
      expect(mockConfigSourceManager.getSources).toHaveBeenCalled();
      expect(await sut.get('openai.key')).toEqual('env_openai_key');
      expect(mockConfigSourceManager.getSources).toHaveBeenCalledTimes(1);
    });

    it('should return undefined if the key is not found in config when isLoaded is true', async () => {
      await sut.loadConfig();
      expect(mockConfigSourceManager.getSources).toHaveBeenCalled();
      const result = await sut.get('nonExistingKey');
      expect(result).toBeUndefined();
      expect(mockConfigSourceManager.getSources).toHaveBeenCalledTimes(1);
    });

    it('should return the value from the first matching source', async () => {
      const mockEnvConfig = {
        openai: { key: 'env_openai_key' },
      };

      vi.mocked(mockConfigSourceManager.load).mockResolvedValueOnce(
        mockEnvConfig,
      );

      const result = await sut.get('openai.key');
      expect(result).toBe(mockEnvConfig.openai.key);
      expect(mockConfigSourceManager.load).toHaveBeenCalledTimes(1);
    });

    it('should cache the result after loading a source', async () => {
      const mockEnvConfig = {
        openai: { key: 'env_openai_key' },
      };

      vi.mocked(mockConfigSourceManager.load).mockResolvedValueOnce(
        mockEnvConfig,
      );

      await sut.get('openai.key');
      expect(mockConfigSourceManager.load).toHaveBeenCalled();
      expect(await sut.get('openai.key')).toBe(mockEnvConfig.openai.key);
      expect(mockConfigSourceManager.load).toHaveBeenCalledTimes(1);
    });

    it('should return undefined if the key is not found in any source', async () => {
      const mockEnvConfig = {
        openaiKey: 'env_key',
      };

      vi.mocked(mockConfigSourceManager.load).mockResolvedValueOnce(
        mockFileContent,
      );
      vi.mocked(mockConfigSourceManager.load).mockResolvedValueOnce(
        mockEnvConfig,
      );

      const result = await sut.get('nonExistingKey');
      expect(result).toBeUndefined();
    });
  });

  describe('set', () => {
    it('should log an error and return when validation fails', async () => {
      vi.mocked(mockConfigValidator.validateKey).mockReturnValueOnce({
        valid: false,
        errors: [
          { keyword: 'someKey', message: 'Missing somekey' } as ErrorObject,
        ],
      });

      const consoleErrorSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      await sut.set('invalidKey' as keyof MyConfig, 'value', 'source');

      expect(consoleErrorSpy).toHaveBeenCalled();
      consoleErrorSpy.mockRestore();
    });

    it('should save a value', async () => {
      vi.mocked(mockConfigSourceManager.load).mockResolvedValue({
        ...mockFileContent,
      });

      const sourceName = 'file';

      await sut.set('excludeFiles', ['test'], sourceName);

      expect(mockConfigSourceManager.write).toHaveBeenCalledWith(sourceName, {
        openai: { key: 'mock_openai_key' },
        excludeFiles: ['test'],
      });

      expect(mockConfigValidator.validateKey).toHaveBeenCalledWith(
        'excludeFiles',
        ['test'],
      );

      vi.mocked(mockConfigSourceManager.load).mockResolvedValue({
        ...mockFileContent,
      });

      await sut.set('openai.key', 'key', sourceName);

      expect(mockConfigSourceManager.write).toHaveBeenCalledWith(sourceName, {
        openai: { key: 'key' },
        excludeFiles: ['test'],
      });
    });
  });

  describe('unset', () => {
    it('should remove an existing configuration from the file', async () => {
      vi.mocked(mockConfigSourceManager.load).mockResolvedValue({
        ...mockFileContent,
      });

      const sourceName = 'file';

      await sut.unset('openai.key', sourceName);

      expect(mockConfigSourceManager.load).toHaveBeenCalled();

      expect(mockConfigSourceManager.write).toHaveBeenCalledWith(sourceName, {
        openai: {},
        excludeFiles: ['node_modules', '.git'],
      });
    });
  });
});
