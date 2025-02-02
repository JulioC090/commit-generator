import GetHistory from '@/actions/GetHistory';
import fs from 'node:fs/promises';
import path from 'node:path';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('node:fs/promises');

const mockHistoryPath = path.join(__dirname, 'history');

describe('GetHistory', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('should return reversed lines from the file', async () => {
    const fileContent = `First line\nSecond line\nThird line`;
    vi.mocked(fs.readFile).mockResolvedValue(fileContent);

    const getHistory = new GetHistory({ historyPath: mockHistoryPath });
    const result = await getHistory.execute(2);

    expect(fs.readFile).toHaveBeenCalledWith(mockHistoryPath, 'utf8');
    expect(result).toEqual(['Third line', 'Second line']);
  });

  it('should return only 1 line if numberOfLines is negative', async () => {
    const fileContent = `First line\nSecond line\nThird line`;
    vi.mocked(fs.readFile).mockResolvedValue(fileContent);

    const getHistory = new GetHistory({ historyPath: mockHistoryPath });
    const result = await getHistory.execute(-5);

    expect(result).toEqual(['Third line']);
  });

  it('should return all lines if numberOfLines is greater than the number of lines in the file', async () => {
    const fileContent = `First line\nSecond line\nThird line`;
    vi.mocked(fs.readFile).mockResolvedValue(fileContent);

    const getHistory = new GetHistory({ historyPath: mockHistoryPath });
    const result = await getHistory.execute(10);

    expect(result).toEqual(['Third line', 'Second line', 'First line']);
  });

  it('should return an empty array if the file is empty', async () => {
    vi.mocked(fs.readFile).mockResolvedValue('');

    const getHistory = new GetHistory({ historyPath: mockHistoryPath });
    const result = await getHistory.execute(5);

    expect(result).toEqual([]);
  });

  it('should return an empty array if reading the file fails', async () => {
    vi.mocked(fs.readFile).mockRejectedValue(new Error('File not found'));

    const getHistory = new GetHistory({ historyPath: mockHistoryPath });
    const result = await getHistory.execute(3);

    expect(result).toEqual([]);
  });
});
