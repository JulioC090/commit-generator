import GenerateAndCommit from '@/actions/GenerateAndCommit';
import GenerateCommit from '@/actions/GenerateCommit';
import Git from '@/utils/Git';
import { describe, expect, it, vi } from 'vitest';

const mockGit = {
  commit: vi.fn(),
} as unknown as Git;

const mockGenerateCommit = {
  execute: vi.fn(),
} as unknown as GenerateCommit;

describe('GenerateAndCommit', () => {
  it('should generate a commit message and commit', async () => {
    vi.mocked(mockGenerateCommit.execute).mockResolvedValue('commit message');

    const sut = new GenerateAndCommit({
      generateCommit: mockGenerateCommit,
      git: mockGit,
    });

    await sut.execute({});

    expect(mockGit.commit).toHaveBeenCalledWith('commit message');
  });
});
