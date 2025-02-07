import ICommitHistory from '@/application/interfaces/ICommitHistory';
import AmendGenerated from '@/application/use-cases/AmendGenerated';
import { IGit } from '@commit-generator/git';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const mockCommitHistory = {
  add: vi.fn(),
  get: vi.fn(),
} as unknown as ICommitHistory;

const mockGit = {
  amend: vi.fn(),
} as unknown as IGit;

describe('AmendGenerated', () => {
  let sut: AmendGenerated;

  beforeEach(() => {
    sut = new AmendGenerated({
      commitHistory: mockCommitHistory,
      git: mockGit,
    });

    vi.resetAllMocks();
  });

  it('should amend the last commit with the latest generated message', async () => {
    vi.mocked(mockCommitHistory.get).mockResolvedValueOnce([
      'Fix bug in authentication',
    ]);

    await sut.execute();

    expect(mockCommitHistory.get).toHaveBeenCalledWith(1);
    expect(mockGit.amend).toHaveBeenCalledWith('Fix bug in authentication');
  });

  it('should throw an error if no commits are found', async () => {
    vi.mocked(mockCommitHistory.get).mockResolvedValueOnce([]);

    await expect(sut.execute()).rejects.toThrow('No commits found in history');

    expect(mockCommitHistory.get).toHaveBeenCalledWith(1);
    expect(mockGit.amend).not.toHaveBeenCalled();
  });
});
