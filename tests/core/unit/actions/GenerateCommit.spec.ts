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
  log: vi.fn(),
} as unknown as IGit;

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
      commitGenerator: mockCommitGenerator,
      git: mockGit,
      addHistory: mockAddHistory,
    });

    await sut.execute({});

    expect(exitWithError).toHaveBeenCalledWith('Error: No staged files found.');
  });

  it('should save commit in history', async () => {
    vi.mocked(mockGit.isRepository).mockReturnValue(true);
    vi.mocked(mockGit.diff).mockReturnValue('some diff');
    mockCommitGenerator.generate.mockResolvedValue('commit message');

    const sut = new GenerateCommit({
      commitGenerator: mockCommitGenerator,
      git: mockGit,
      addHistory: mockAddHistory,
    });

    await sut.execute({});

    expect(mockAddHistory.execute).toHaveBeenCalledWith('commit message');
  });
});
