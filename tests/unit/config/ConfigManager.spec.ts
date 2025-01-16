import ConfigManager from '@/config/ConfigManager';
import ConfigSourceManager from '@/config/ConfigSourceManager';
import { Source } from '@/config/types/Source';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const mockFileContent = {
  openaiKey: 'mock_openai_key',
  excludeFiles: ['node_modules', '.git'],
};

const mockSources: Array<Source> = [
  { name: 'file', type: 'file', path: 'path/to/file' },
  { name: 'env', type: 'env' },
];

const mockConfigSourceManager = {
  getSources: vi.fn(),
  load: vi.fn(),
  write: vi.fn(),
} as unknown as ConfigSourceManager;

describe('ConfigManager', () => {
  let sut: ConfigManager;

  beforeEach(() => {
    vi.resetAllMocks();

    sut = new ConfigManager({ configSourceManager: mockConfigSourceManager });
    vi.mocked(mockConfigSourceManager.getSources).mockReturnValue(mockSources);
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
        openaiKey: 'env_openai_key',
      });

      const result = await sut.loadConfig();

      expect(result).toEqual({
        openaiKey: 'env_openai_key',
        excludeFiles: ['node_modules', '.git'],
      });
    });
  });

  describe('get', () => {
    it('should return the value from config when isLoaded is true', async () => {
      vi.mocked(mockConfigSourceManager.load).mockResolvedValueOnce(
        mockFileContent,
      );
      vi.mocked(mockConfigSourceManager.load).mockResolvedValueOnce({
        openaiKey: 'env_openai_key',
      });

      await sut.loadConfig();
      expect(mockConfigSourceManager.getSources).toHaveBeenCalled();
      expect(await sut.get('excludeFiles')).toEqual(['node_modules', '.git']);
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
        openaiKey: 'env_key',
      };

      vi.mocked(mockConfigSourceManager.load).mockResolvedValueOnce(
        mockEnvConfig,
      );

      const result = await sut.get('openaiKey');
      expect(result).toBe(mockEnvConfig.openaiKey);
      expect(mockConfigSourceManager.load).toHaveBeenCalledTimes(1);
    });

    it('should cache the result after loading a source', async () => {
      const mockEnvConfig = {
        openaiKey: 'env_key',
      };

      vi.mocked(mockConfigSourceManager.load).mockResolvedValueOnce(
        mockEnvConfig,
      );

      await sut.get('openaiKey');
      expect(mockConfigSourceManager.load).toHaveBeenCalled();
      expect(await sut.get('openaiKey')).toBe(mockEnvConfig.openaiKey);
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
    it('should save a single value as a string', async () => {
      vi.mocked(mockConfigSourceManager.load).mockResolvedValueOnce({
        ...mockFileContent,
      });

      const sourceName = 'file';

      await sut.set('openaiKey', 'new_openai_key', sourceName);

      expect(mockConfigSourceManager.write).toHaveBeenCalledWith(sourceName, {
        openaiKey: 'new_openai_key',
        excludeFiles: ['node_modules', '.git'],
      });
    });

    it('should save a comma-separated value as an array', async () => {
      vi.mocked(mockConfigSourceManager.load).mockResolvedValueOnce({
        ...mockFileContent,
      });

      const sourceName = 'file';

      await sut.set('excludeFiles', 'src,dist', sourceName);

      expect(mockConfigSourceManager.write).toHaveBeenCalledWith(sourceName, {
        openaiKey: 'mock_openai_key',
        excludeFiles: ['src', 'dist'],
      });
    });
  });

  describe('unset', () => {
    it('should remove an existing configuration from the file', async () => {
      vi.mocked(mockConfigSourceManager.load).mockResolvedValue(
        mockFileContent,
      );

      const sourceName = 'file';

      await sut.unset('excludeFiles', sourceName);

      expect(mockConfigSourceManager.load).toHaveBeenCalled();

      expect(mockConfigSourceManager.write).toHaveBeenCalledWith(sourceName, {
        openaiKey: 'mock_openai_key',
      });
    });
  });
});
