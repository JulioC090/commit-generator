import AddHistory from '@/actions/AddHistory';
import GenerateCommit from '@/actions/GenerateCommit';
import { exitWithError } from '@/utils/errorHandler';
import Git from '@/utils/Git';
import { describe, expect, it, vi } from 'vitest';

vi.mock('@/utils/errorHandler', () => ({
  exitWithError: vi.fn(),
}));

const mockGit = {
  isRepository: vi.fn(),
  diff: vi.fn(),
  commit: vi.fn(),
};

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
  it('should exit with error if not in a Git repository', async () => {
    mockGit.isRepository.mockReturnValue(false);

    const sut = new GenerateCommit({
      userInteractor: mockUserInteractor,
      commitGenerator: mockCommitGenerator,
      git: mockGit as unknown as Git,
      addHistory: mockAddHistory,
    });

    await sut.execute({});

    expect(exitWithError).toHaveBeenCalledWith(
      'Error: The current directory is not a valid Git repository.',
    );
  });

  it('should exit with error if there are no staged files', async () => {
    mockGit.isRepository.mockReturnValue(true);
    mockGit.diff.mockReturnValue(null);

    const sut = new GenerateCommit({
      userInteractor: mockUserInteractor,
      commitGenerator: mockCommitGenerator,
      git: mockGit as unknown as Git,
      addHistory: mockAddHistory,
    });

    await sut.execute({});

    expect(exitWithError).toHaveBeenCalledWith('Error: No staged files found.');
  });

  it('should confirm the commit message if not forced', async () => {
    mockGit.isRepository.mockReturnValue(true);
    mockGit.diff.mockReturnValue('some diff');
    mockCommitGenerator.generate.mockResolvedValue('initial commit message');
    mockUserInteractor.confirmCommitMessage.mockResolvedValue(
      'final commit message',
    );

    const sut = new GenerateCommit({
      userInteractor: mockUserInteractor,
      commitGenerator: mockCommitGenerator,
      git: mockGit as unknown as Git,
      addHistory: mockAddHistory,
    });

    await sut.execute({ force: false });

    expect(mockUserInteractor.confirmCommitMessage).toHaveBeenCalledWith(
      'initial commit message',
    );
    expect(mockGit.commit).toHaveBeenCalledWith('final commit message');
  });

  it('should save commit in history', async () => {
    mockGit.isRepository.mockReturnValue(true);
    mockGit.diff.mockReturnValue('some diff');
    mockCommitGenerator.generate.mockResolvedValue('commit message');

    const sut = new GenerateCommit({
      userInteractor: mockUserInteractor,
      commitGenerator: mockCommitGenerator,
      git: mockGit as unknown as Git,
      addHistory: mockAddHistory,
    });

    await sut.execute({ force: true });

    expect(mockAddHistory.execute).toHaveBeenCalledWith('commit message');
  });

  it('should generate a commit message and commit', async () => {
    mockGit.isRepository.mockReturnValue(true);
    mockGit.diff.mockReturnValue('some diff');
    mockCommitGenerator.generate.mockResolvedValue('commit message');

    const sut = new GenerateCommit({
      userInteractor: mockUserInteractor,
      commitGenerator: mockCommitGenerator,
      git: mockGit as unknown as Git,
      addHistory: mockAddHistory,
    });

    await sut.execute({ force: true });

    expect(mockCommitGenerator.generate).toHaveBeenCalledWith({
      diff: 'some diff',
      type: undefined,
    });
    expect(mockGit.commit).toHaveBeenCalledWith('commit message');
  });
});
