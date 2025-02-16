import CommitGenerated from '@/application/CommitGenerated';
import ICommitHistory from '@/types/ICommitHistory';
import { IGit } from '@commit-generator/git';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const mockCommitHistory = {
  add: vi.fn(),
  get: vi.fn(),
} as unknown as ICommitHistory;

const mockGitMock = {
  commit: vi.fn(),
} as unknown as IGit;

describe('CommitGenerated', () => {
  let sut: CommitGenerated;

  beforeEach(() => {
    sut = new CommitGenerated({
      commitHistory: mockCommitHistory,
      git: mockGitMock,
    });

    vi.resetAllMocks();
  });

  it('should commit the last commit message if history exists', async () => {
    vi.mocked(mockCommitHistory.get).mockResolvedValueOnce(['Initial commit']);

    await sut.execute();

    expect(mockCommitHistory.get).toHaveBeenCalledWith(1);
    expect(mockGitMock.commit).toHaveBeenCalledWith('Initial commit');
  });

  it('should throw an error if no commits are found in history', async () => {
    vi.mocked(mockCommitHistory.get).mockResolvedValueOnce([]);

    await expect(sut.execute()).rejects.toThrow('No commits found in history');

    expect(mockCommitHistory.get).toHaveBeenCalledWith(1);
    expect(mockGitMock.commit).not.toHaveBeenCalled();
  });
});
