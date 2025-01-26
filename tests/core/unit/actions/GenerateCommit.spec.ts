import { exitWithError } from '@/cli/utils/errorHandler';
import AddHistory from '@/core/actions/AddHistory';
import GenerateCommit from '@/core/actions/GenerateCommit';
import IGit from '@/git/types/IGit';
import { describe, expect, it, vi } from 'vitest';

vi.mock('@/cli/utils/errorHandler', () => ({
  exitWithError: vi.fn(),
}));

const mockGit = {
  isRepository: vi.fn(),
  diff: vi.fn(),
  commit: vi.fn(),
} as unknown as IGit;

const mockUserInteractor = {
  confirmCommitMessage: vi.fn(),
};

const mockCommitGenerator = {
  generate: vi.fn(),
};

const mockAddHistory = {
  execute: vi.fn(),
} as unknown as AddHistory;

describe('GenerateCommit', () => {
  it('should exit with error if there are no staged files', async () => {
    vi.mocked(mockGit.isRepository).mockReturnValue(true);
    vi.mocked(mockGit.diff).mockReturnValue('');

    const sut = new GenerateCommit({
      userInteractor: mockUserInteractor,
      commitGenerator: mockCommitGenerator,
      git: mockGit,
      addHistory: mockAddHistory,
    });

    await sut.execute({});

    expect(exitWithError).toHaveBeenCalledWith('Error: No staged files found.');
  });

  it('should confirm the commit message if not forced', async () => {
    vi.mocked(mockGit.isRepository).mockReturnValue(true);
    vi.mocked(mockGit.diff).mockReturnValue('some diff');
    mockCommitGenerator.generate.mockResolvedValue('initial commit message');
    mockUserInteractor.confirmCommitMessage.mockResolvedValue(
      'final commit message',
    );

    const sut = new GenerateCommit({
      userInteractor: mockUserInteractor,
      commitGenerator: mockCommitGenerator,
      git: mockGit,
      addHistory: mockAddHistory,
    });

    const result = await sut.execute({ force: false });

    expect(mockUserInteractor.confirmCommitMessage).toHaveBeenCalledWith(
      'initial commit message',
    );

    expect(result).toBe('final commit message');
  });

  it('should save commit in history', async () => {
    vi.mocked(mockGit.isRepository).mockReturnValue(true);
    vi.mocked(mockGit.diff).mockReturnValue('some diff');
    mockCommitGenerator.generate.mockResolvedValue('commit message');

    const sut = new GenerateCommit({
      userInteractor: mockUserInteractor,
      commitGenerator: mockCommitGenerator,
      git: mockGit,
      addHistory: mockAddHistory,
    });

    await sut.execute({ force: true });

    expect(mockAddHistory.execute).toHaveBeenCalledWith('commit message');
  });
});
