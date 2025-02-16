import GenerateCommit from '@/application/GenerateCommit';
import ICommitHistory from '@/types/ICommitHistory';
import { IGit } from '@commit-generator/git';
import { describe, expect, it, vi } from 'vitest';

const mockGit = {
  isRepository: vi.fn(),
  diff: vi.fn(),
  commit: vi.fn(),
  log: vi.fn(),
} as unknown as IGit;

const mockCommitGenerator = {
  generate: vi.fn(),
};

const mockCommitHistory = {
  add: vi.fn(),
  get: vi.fn(),
} as unknown as ICommitHistory;

describe('GenerateCommit', () => {
  it('should generate a commit', async () => {
    vi.mocked(mockGit.isRepository).mockReturnValue(true);
    vi.mocked(mockGit.diff).mockReturnValue('some diff');
    mockCommitGenerator.generate.mockResolvedValue('commit message');

    const sut = new GenerateCommit({
      commitGenerator: mockCommitGenerator,
      git: mockGit,
      commitHistory: mockCommitHistory,
    });

    const result = await sut.execute({ type: 'feat', context: 'some context' });

    expect(mockCommitHistory.add).toHaveBeenCalledWith('commit message');
    expect(mockCommitGenerator.generate).toHaveBeenCalledWith({
      diff: 'some diff',
      type: 'feat',
      context: 'some context',
    });
    expect(result).toBe('commit message');
  });

  it('should throw if there are no staged files', async () => {
    vi.mocked(mockGit.isRepository).mockReturnValue(true);
    vi.mocked(mockGit.diff).mockReturnValue('');

    const sut = new GenerateCommit({
      commitGenerator: mockCommitGenerator,
      commitHistory: mockCommitHistory,
      git: mockGit,
    });

    await expect(sut.execute({})).rejects.toThrow(
      'Error: No staged files found.',
    );
  });

  it('should save commit in history', async () => {
    vi.mocked(mockGit.isRepository).mockReturnValue(true);
    vi.mocked(mockGit.diff).mockReturnValue('some diff');
    mockCommitGenerator.generate.mockResolvedValue('commit message');

    const sut = new GenerateCommit({
      commitGenerator: mockCommitGenerator,
      git: mockGit,
      commitHistory: mockCommitHistory,
    });

    await sut.execute({});

    expect(mockCommitHistory.add).toHaveBeenCalledWith('commit message');
  });
});
