import buildDiffArgs from '@/git/buildDiffArgs';
import { emptyTree } from '@/git/constants';
import { execSync } from 'node:child_process';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('node:child_process', () => ({
  execSync: vi.fn(),
}));

describe('buildDiffArgs', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('should return empty string when no options are provided', () => {
    expect(buildDiffArgs({})).toBe('');
  });

  it('should include --cached when staged is true', () => {
    expect(buildDiffArgs({ staged: true })).toBe('--cached --staged');
  });

  it('should throw an error when lastCommit and staged are both true', () => {
    expect(() => buildDiffArgs({ lastCommit: true, staged: true })).toThrow(
      'Cannot use both lastCommit and staged together',
    );
  });

  it('should throw an error when lastCommit is true and no commits exist', () => {
    vi.mocked(execSync).mockReturnValueOnce('');

    expect(() => buildDiffArgs({ lastCommit: true })).toThrow(
      'No commits were found',
    );
  });

  it('should compare the only commit with the empty tree when only one commit exists', () => {
    vi.mocked(execSync).mockReturnValueOnce('abcd1234\n');

    expect(buildDiffArgs({ lastCommit: true })).toBe(`${emptyTree} abcd1234`);
  });

  it('should compare last two commits when there are two or more commits', () => {
    vi.mocked(execSync).mockReturnValueOnce('abcd1234\nefgh5678\n');

    expect(buildDiffArgs({ lastCommit: true })).toBe('efgh5678 abcd1234');
  });

  it('should exclude files when excludeFiles is provided', () => {
    expect(buildDiffArgs({ excludeFiles: ['file1.txt', 'file2.js'] })).toBe(
      '-- . :(exclude)file1.txt :(exclude)file2.js',
    );
  });

  it('should combine all options correctly', () => {
    expect(
      buildDiffArgs({
        staged: true,
        excludeFiles: ['file1.txt', 'file2.js'],
      }),
    ).toBe('--cached --staged -- . :(exclude)file1.txt :(exclude)file2.js');

    vi.mocked(execSync).mockReturnValueOnce('abcd1234\nefgh5678\n');

    expect(
      buildDiffArgs({
        lastCommit: true,
        excludeFiles: ['file1.txt', 'file2.js'],
      }),
    ).toBe('efgh5678 abcd1234 -- . :(exclude)file1.txt :(exclude)file2.js');
  });
});
