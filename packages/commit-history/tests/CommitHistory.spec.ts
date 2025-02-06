import CommitHistory from '@/CommitHistory';
import fs from 'node:fs/promises';
import path from 'node:path';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('node:fs/promises');

const mockHistoryPath = path.join(__dirname, 'history');

describe('CommitHistory', () => {
  let sut: CommitHistory;

  beforeEach(async () => {
    vi.resetAllMocks();
    sut = new CommitHistory(mockHistoryPath);
  });

  describe('add', () => {
    it('should append a line to the history file', async () => {
      const commitMessage = 'Test commit';

      await sut.add(commitMessage);

      expect(fs.appendFile).toHaveBeenCalledWith(
        mockHistoryPath,
        commitMessage + '\n',
        'utf8',
      );
    });

    it('should append multiple lines to the history file', async () => {
      const commitMessages = ['First commit', 'Second commit'];

      for (const msg of commitMessages) {
        await sut.add(msg);
      }

      expect(fs.appendFile).toHaveBeenCalledTimes(2);
    });
  });

  describe('get', () => {
    it('should return reversed lines from the file', async () => {
      const fileContent = `First line\nSecond line\nThird line`;
      vi.mocked(fs.readFile).mockResolvedValue(fileContent);

      const result = await sut.get(2);

      expect(fs.readFile).toHaveBeenCalledWith(mockHistoryPath, 'utf8');
      expect(result).toEqual(['Third line', 'Second line']);
    });

    it('should return only 1 line if numberOfLines is negative', async () => {
      const fileContent = `First line\nSecond line\nThird line`;
      vi.mocked(fs.readFile).mockResolvedValue(fileContent);

      const result = await sut.get(-5);

      expect(result).toEqual(['Third line']);
    });

    it('should return all lines if numberOfLines is greater than the number of lines in the file', async () => {
      const fileContent = `First line\nSecond line\nThird line`;
      vi.mocked(fs.readFile).mockResolvedValue(fileContent);

      const result = await sut.get(10);

      expect(result).toEqual(['Third line', 'Second line', 'First line']);
    });

    it('should return an empty array if the file is empty', async () => {
      vi.mocked(fs.readFile).mockResolvedValue('');

      const result = await sut.get(5);

      expect(result).toEqual([]);
    });

    it('should return an empty array if reading the file fails', async () => {
      vi.mocked(fs.readFile).mockRejectedValue(new Error('File not found'));

      const result = await sut.get(3);

      expect(result).toEqual([]);
    });
  });
});
