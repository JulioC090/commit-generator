import EditLastGenerated from '@/application/EditLastGenerated';
import ICommitHistory from '@/types/ICommitHistory';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const mockCommitHistory = {
  add: vi.fn(),
  get: vi.fn().mockResolvedValue(['Initial commit']),
} as unknown as ICommitHistory;

const mockEditMessage = vi.fn();

describe('EditLastGenerated', () => {
  let sut: EditLastGenerated;

  beforeEach(() => {
    vi.resetAllMocks();

    sut = new EditLastGenerated({
      commitHistory: mockCommitHistory,
      editMessage: mockEditMessage,
    });
  });

  it('should edit the last commit message and save it to history', async () => {
    vi.mocked(mockCommitHistory.get).mockResolvedValueOnce(['Initial commit']);
    vi.mocked(mockEditMessage).mockReturnValueOnce('Updated commit message');

    await sut.execute();

    expect(mockCommitHistory.get).toHaveBeenCalledWith(1);
    expect(mockEditMessage).toHaveBeenCalledWith('Initial commit');
    expect(mockCommitHistory.add).toHaveBeenCalledWith(
      'Updated commit message',
    );
  });

  it('should throw an error if no commits are found', async () => {
    vi.mocked(mockCommitHistory.get).mockResolvedValueOnce([]);

    await expect(sut.execute()).rejects.toThrow('No commits found in history');

    expect(mockCommitHistory.get).toHaveBeenCalledWith(1);
    expect(mockCommitHistory.add).not.toHaveBeenCalled();
  });

  it('should throw an error if the new commit message is empty', async () => {
    vi.mocked(mockCommitHistory.get).mockResolvedValueOnce(['Initial commit']);
    vi.mocked(mockEditMessage).mockReturnValueOnce('');

    await expect(sut.execute()).rejects.toThrow(
      'Commit message cannot be empty',
    );

    expect(mockCommitHistory.get).toHaveBeenCalledWith(1);
    expect(mockEditMessage).toHaveBeenCalledWith('Initial commit');
    expect(mockCommitHistory.add).not.toHaveBeenCalled();
  });
});
