import AmendGenerated from '@/application/use-cases/AmendGenerated';
import GetHistory from '@/application/use-cases/GetHistory';
import { IGit } from '@commit-generator/git';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const mockGetHistory = {
  execute: vi.fn(),
} as unknown as GetHistory;

const mockGit = {
  amend: vi.fn(),
} as unknown as IGit;

describe('AmendGenerated', () => {
  let sut: AmendGenerated;

  beforeEach(() => {
    sut = new AmendGenerated({
      getHistory: mockGetHistory,
      git: mockGit,
    });

    vi.resetAllMocks();
  });

  it('should amend the last commit with the latest generated message', async () => {
    vi.mocked(mockGetHistory.execute).mockResolvedValueOnce([
      'Fix bug in authentication',
    ]);

    await sut.execute();

    expect(mockGetHistory.execute).toHaveBeenCalledWith(1);
    expect(mockGit.amend).toHaveBeenCalledWith('Fix bug in authentication');
  });

  it('should throw an error if no commits are found', async () => {
    vi.mocked(mockGetHistory.execute).mockResolvedValueOnce([]);

    await expect(sut.execute()).rejects.toThrow('No commits found in history');

    expect(mockGetHistory.execute).toHaveBeenCalledWith(1);
    expect(mockGit.amend).not.toHaveBeenCalled();
  });
});
