import AddHistory from '@/actions/AddHistory';
import EditLastGenerated from '@/actions/EditLastGenerated';
import GetHistory from '@/actions/GetHistory';
import { IGit } from '@commit-generator/git';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const mockGetHistory = {
  execute: vi.fn().mockResolvedValue(['Initial commit']),
} as unknown as GetHistory;

const mockAddHistory = {
  execute: vi.fn(),
} as unknown as AddHistory;

const mockGit = {
  amend: vi.fn(),
} as unknown as IGit;

const mockEditMessage = vi.fn();

describe('EditLastGenerated', () => {
  let sut: EditLastGenerated;

  beforeEach(() => {
    vi.resetAllMocks();

    sut = new EditLastGenerated({
      getHistory: mockGetHistory,
      addHistory: mockAddHistory,
      git: mockGit,
      editMessage: mockEditMessage,
    });
  });

  it('should edit the last commit message and save it to history', async () => {
    vi.mocked(mockGetHistory.execute).mockResolvedValueOnce(['Initial commit']);
    vi.mocked(mockEditMessage).mockReturnValueOnce('Updated commit message');

    await sut.execute();

    expect(mockGetHistory.execute).toHaveBeenCalledWith(1);
    expect(mockEditMessage).toHaveBeenCalledWith('Initial commit');
    expect(mockAddHistory.execute).toHaveBeenCalledWith(
      'Updated commit message',
    );
  });

  it('should throw an error if no commits are found', async () => {
    vi.mocked(mockGetHistory.execute).mockResolvedValueOnce([]);

    await expect(sut.execute()).rejects.toThrow('No commits found in history');

    expect(mockGetHistory.execute).toHaveBeenCalledWith(1);
    expect(mockAddHistory.execute).not.toHaveBeenCalled();
  });

  it('should throw an error if the new commit message is empty', async () => {
    vi.mocked(mockGetHistory.execute).mockResolvedValueOnce(['Initial commit']);
    vi.mocked(mockEditMessage).mockReturnValueOnce('');

    await expect(sut.execute()).rejects.toThrow(
      'Commit message cannot be empty',
    );

    expect(mockGetHistory.execute).toHaveBeenCalledWith(1);
    expect(mockEditMessage).toHaveBeenCalledWith('Initial commit');
    expect(mockAddHistory.execute).not.toHaveBeenCalled();
  });
});
