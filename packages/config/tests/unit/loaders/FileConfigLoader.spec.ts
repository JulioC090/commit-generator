import FileConfigLoader from '@/loaders/FileConfigLoader';
import { ISource } from '@/types/ISource';
import fs from 'node:fs/promises';
import { describe, expect, it, vi } from 'vitest';

const sut = new FileConfigLoader();

const mockFilePath = 'path/to/file';
const mockFileContent = JSON.stringify({
  openaiKey: 'file_key',
});

vi.mock('node:fs/promises');

describe('FileConfigLoader', () => {
  describe('validate', () => {
    it('should throw an error if source of type "file" has no path', () => {
      const invalidSource: ISource = { name: 'invalidSource', type: 'file' };
      const sut = new FileConfigLoader();

      expect(() => sut.validate(invalidSource)).toThrowError(
        'Config Error: Source of type "file" must have a "path": invalidSource',
      );
    });

    it('should not throw an error if source of type "file" has a path', () => {
      const source: ISource = {
        name: 'testSource',
        type: 'file',
        path: '/config.json',
      };

      const sut = new FileConfigLoader();

      expect(() => sut.validate(source)).not.toThrow();
    });
  });

  describe('load', () => {
    it('should load and parse the config file correctly', async () => {
      vi.mocked(fs.readFile).mockResolvedValue(mockFileContent);
      const config = await sut.load({ path: mockFilePath } as ISource);

      expect(config).toEqual(JSON.parse(mockFileContent));
      expect(fs.readFile).toHaveBeenCalledWith(mockFilePath, {
        encoding: 'utf8',
      });
    });

    it('should return an empty object on error', async () => {
      vi.mocked(fs.readFile).mockRejectedValue(new Error('Permission denied'));
      const config = await sut.load({ path: mockFilePath } as ISource);
      expect(config).toEqual({});
    });
  });

  describe('write', () => {
    it('should write the config to the file correctly', async () => {
      vi.mocked(fs.writeFile).mockResolvedValue();
      await sut.write({ path: mockFilePath } as ISource, { openaiKey: 'key' });
      expect(fs.writeFile).toHaveBeenCalledWith(
        mockFilePath,
        JSON.stringify({ openaiKey: 'key' }, null, 2),
        {
          encoding: 'utf8',
        },
      );
    });

    it('should throw an error if the file cannot be written', async () => {
      vi.mocked(fs.writeFile).mockRejectedValue(new Error('Permission denied'));
      expect(
        async () =>
          await sut.write({ path: mockFilePath } as ISource, {
            openaiKey: 'key',
          }),
      ).rejects.toThrow('Permission denied');
    });
  });
});
