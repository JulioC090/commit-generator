import ICommitValidator from '@/application/interfaces/ICommitValidator';
import AddHistory from '@/application/use-cases/AddHistory';
import ValidateCommit from '@/application/use-cases/ValidateCommit';
import { IGit } from '@commit-generator/git';
import { beforeEach, describe, expect, it, vi } from 'vitest';

describe('ValidateCommit', () => {
  let sut: ValidateCommit;
  let mockCommitValidator: ICommitValidator;
  let mockGit: IGit;
  let mockAddHistory: AddHistory;

  beforeEach(() => {
    vi.resetAllMocks();

    mockCommitValidator = {
      validate: vi.fn(),
    };

    mockGit = {
      diff: vi.fn(),
      log: vi.fn(),
    } as unknown as IGit;

    mockAddHistory = {
      execute: vi.fn(),
    } as unknown as AddHistory;

    sut = new ValidateCommit({
      commitValidator: mockCommitValidator,
      git: mockGit,
      addHistory: mockAddHistory,
    });
  });

  it('should validate a staged commit message', async () => {
    vi.mocked(mockGit.diff).mockReturnValueOnce('mocked diff');
    vi.mocked(mockCommitValidator.validate).mockResolvedValueOnce({
      isValid: true,
      recommendedMessage: 'feat(auth): improve login security',
      analysis: 'Ok',
    });

    const result = await sut.execute({
      commitMessage: 'fix: adjust login flow',
    });

    expect(mockGit.diff).toHaveBeenCalledWith({
      staged: true,
      excludeFiles: undefined,
    });
    expect(mockCommitValidator.validate).toHaveBeenCalledWith(
      'fix: adjust login flow',
      { diff: 'mocked diff' },
    );
    expect(mockAddHistory.execute).toHaveBeenCalledWith(
      'feat(auth): improve login security',
    );
    expect(result).toEqual({
      isValid: true,
      recommendedMessage: 'feat(auth): improve login security',
      analysis: 'Ok',
    });
  });

  it('should validate the last commit if no commit message is provided', async () => {
    vi.mocked(mockGit.diff).mockReturnValueOnce('mocked diff');
    vi.mocked(mockGit.log).mockReturnValueOnce('Initial commit message');
    vi.mocked(mockCommitValidator.validate).mockResolvedValueOnce({
      isValid: true,
      recommendedMessage: 'feat(auth): improve login security',
      analysis: 'Ok',
    });

    const validateCommit = new ValidateCommit({
      commitValidator: mockCommitValidator,
      git: mockGit,
      addHistory: mockAddHistory,
    });

    const result = await validateCommit.execute({});

    expect(mockGit.diff).toHaveBeenCalledWith({
      excludeFiles: undefined,
      lastCommit: true,
    });
    expect(mockGit.log).toHaveBeenCalledWith(1);
    expect(mockCommitValidator.validate).toHaveBeenCalledWith(
      'Initial commit message',
      { diff: 'mocked diff' },
    );
    expect(mockAddHistory.execute).toHaveBeenCalledWith(
      'feat(auth): improve login security',
    );
    expect(result).toEqual({
      isValid: true,
      recommendedMessage: 'feat(auth): improve login security',
      analysis: 'Ok',
    });
  });
});
