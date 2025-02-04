import CommitGenerated from '@/application/use-cases/CommitGenerated';
import GetHistory from '@/application/use-cases/GetHistory';
import { IGit } from '@commit-generator/git';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const mockGetHistory = {
  execute: vi.fn(),
} as unknown as GetHistory;

const mockGitMock = {
  commit: vi.fn(),
} as unknown as IGit;

describe('CommitGenerated', () => {
  let sut: CommitGenerated;

  beforeEach(() => {
    sut = new CommitGenerated({
      getHistory: mockGetHistory,
      git: mockGitMock,
    });

    vi.resetAllMocks();
  });

  it('should commit the last commit message if history exists', async () => {
    vi.mocked(mockGetHistory.execute).mockResolvedValueOnce(['Initial commit']);

    await sut.execute();

    expect(mockGetHistory.execute).toHaveBeenCalledWith(1);
    expect(mockGitMock.commit).toHaveBeenCalledWith('Initial commit');
  });

  it('should throw an error if no commits are found in history', async () => {
    vi.mocked(mockGetHistory.execute).mockResolvedValueOnce([]);

    await expect(sut.execute()).rejects.toThrow('No commits found in history');

    expect(mockGetHistory.execute).toHaveBeenCalledWith(1);
    expect(mockGitMock.commit).not.toHaveBeenCalled();
  });
});
