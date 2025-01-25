import ConfigSourceManager from '@/config/ConfigSourceManager';
import ArgConfigLoader from '@/config/loaders/ArgConfigLoader';
import EnvConfigLoader from '@/config/loaders/EnvConfigLoader';
import FileConfigLoader from '@/config/loaders/FileConfigLoader';
import { Source } from '@/config/types/Source';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const mockFileConfigLoader = {
  load: vi.fn(),
  write: vi.fn(),
} as unknown as FileConfigLoader;

const mockEnvConfigLoader = {
  load: vi.fn(),
} as unknown as EnvConfigLoader;

const mockArgConfigLoader = {
  load: vi.fn(),
} as unknown as ArgConfigLoader;

const mockSources: Array<Source> = [
  { name: 'fileSource', type: 'file', path: '/path/to/config.json' },
  { name: 'envSource', type: 'env' },
  { name: 'argSource', type: 'arg' },
];

describe('ConfigSourceManager', () => {
  let sut: ConfigSourceManager;

  beforeEach(() => {
    sut = new ConfigSourceManager({
      sources: mockSources,
      fileConfigLoader: mockFileConfigLoader,
      envConfigLoader: mockEnvConfigLoader,
      argConfigLoader: mockArgConfigLoader,
    });

    vi.resetAllMocks();
  });

  describe('constructor', () => {
    it('should validate and set sources in constructor', () => {
      expect(sut.getSources()).toEqual(mockSources);
    });

    it('should throw an error if no sources are specified', () => {
      expect(
        () =>
          new ConfigSourceManager({
            sources: [],
            fileConfigLoader: mockFileConfigLoader,
            envConfigLoader: mockEnvConfigLoader,
            argConfigLoader: mockArgConfigLoader,
          }),
      ).toThrow('Config Error: No sources specified');
    });

    it('should throw an error if a file source does not have a path', () => {
      const invalidSource: Array<Source> = [
        { name: 'fileSourceWithoutPath', type: 'file' },
      ];

      expect(
        () =>
          new ConfigSourceManager({
            sources: invalidSource,
            fileConfigLoader: mockFileConfigLoader,
            envConfigLoader: mockEnvConfigLoader,
            argConfigLoader: mockArgConfigLoader,
          }),
      ).toThrowError(
        'Config Error: Source of type "file" must have a "path": fileSourceWithoutPath',
      );
    });
  });

  describe('getSource', () => {
    it('should return a source by name', () => {
      const source = sut.getSource('fileSource');
      expect(source).toEqual(mockSources[0]);
    });

    it('should return undefined for a non-existent source', () => {
      const source = sut.getSource('nonExistentSource');
      expect(source).toBeUndefined();
    });
  });

  describe('getSources', () => {
    it('should return the list of sources', () => {
      const sources = sut.getSources();
      expect(sources).toEqual(mockSources);
    });
  });

  describe('setSources', () => {
    it('should update the list of sources', () => {
      const newSources: Array<Source> = [
        { name: 'newFileSource', type: 'file', path: '/new/path/config.json' },
      ];

      sut.setSources(newSources);
      const sources = sut.getSources();

      expect(sources).toEqual(newSources);
    });

    it('should throw an error if no sources are provided', () => {
      expect(() => sut.setSources([])).toThrowError(
        'Config Error: No sources specified',
      );
    });

    it('should throw an error if a file source does not have a path', () => {
      const invalidSources: Array<Source> = [
        { name: 'invalidSource', type: 'file' },
      ];

      expect(() => sut.setSources(invalidSources)).toThrowError(
        'Config Error: Source of type "file" must have a "path": invalidSource',
      );
    });
  });

  describe('isWritableSource', () => {
    it('should correctly identify writable sources', () => {
      expect(sut.isWritableSource('fileSource')).toBe(true);
      expect(sut.isWritableSource('envSource')).toBe(false);
    });
  });

  describe('load', () => {
    it('should throw when source does not exist', async () => {
      const nonExistentSourceName = 'nonExistentSource';

      await expect(sut.load(nonExistentSourceName)).rejects.toThrowError(
        `Config Error: No source with name "${nonExistentSourceName}" found`,
      );
    });

    it('should load config from a file source', async () => {
      const expectedConfig = { openaiKey: 'fileValue' };
      vi.mocked(mockFileConfigLoader.load).mockResolvedValue(expectedConfig);

      const config = await sut.load('fileSource');
      expect(config).toEqual(expectedConfig);
      expect(mockFileConfigLoader.load).toHaveBeenCalledWith(
        '/path/to/config.json',
      );
    });

    it('should load config from an env source', async () => {
      const expectedConfig = { openaiKey: 'fileValue' };
      vi.mocked(mockEnvConfigLoader.load).mockResolvedValue(expectedConfig);

      const config = await sut.load('envSource');
      expect(config).toEqual(expectedConfig);
      expect(mockEnvConfigLoader.load).toHaveBeenCalled();
    });

    it('should load config from an arg source', async () => {
      const expectedConfig = { openaiKey: 'fileValue' };
      vi.mocked(mockArgConfigLoader.load).mockResolvedValue(expectedConfig);

      const config = await sut.load('argSource');
      expect(config).toEqual(expectedConfig);
      expect(mockArgConfigLoader.load).toHaveBeenCalled();
    });
  });

  describe('write', () => {
    it('should throw when source does not exist', async () => {
      const configToWrite = { openaiKey: 'value' };
      const nonExistentSourceName = 'nonExistentSource';

      await expect(
        sut.write(nonExistentSourceName, configToWrite),
      ).rejects.toThrowError(
        `Config Error: No source with name "${nonExistentSourceName}" found`,
      );
    });

    it('should throw an error if source is not writable on write', async () => {
      const configToWrite = { openaiKey: 'value' };

      await expect(sut.write('envSource', configToWrite)).rejects.toThrow(
        'Config Error: The source "envSource" is not writable',
      );
    });

    it('should write config to a file source', async () => {
      const configToWrite = { openaiKey: 'value' };
      await sut.write('fileSource', configToWrite);

      expect(mockFileConfigLoader.write).toHaveBeenCalledWith(
        '/path/to/config.json',
        configToWrite,
      );
    });
  });
});
