import sanitize from '@/sanitizers/sanitize';
import CommitGenerator from '@/services/CommitGenerator';
import IAIModel from '@/types/IAIModel';
import ICommitInfo from '@/types/ICommitInfo';
import { describe, expect, it, vi } from 'vitest';

vi.mock('@/prompts/generatePrompt', () => ({
  generatePrompt: vi.fn(),
}));

vi.mock('@/sanitizers/sanitize', () => ({
  default: vi.fn(),
}));

describe('CommitGenerator', () => {
  it('should generate a commit using the AI model', async () => {
    const fakeCommitInfo: ICommitInfo = {
      diff: 'some diff',
      type: 'type',
      previousLogs: 'logs',
    };
    const fakeCompletion = 'Fake commit message from AI model';
    const aiModelMock = {
      complete: vi.fn().mockResolvedValue(fakeCompletion),
    } as unknown as IAIModel;

    const sut = new CommitGenerator(aiModelMock);

    vi.mocked(sanitize).mockReturnValue(fakeCompletion);

    const commitMessage = await sut.generate(fakeCommitInfo);

    expect(aiModelMock.complete).toHaveBeenCalledTimes(1);
    expect(sanitize).toHaveBeenCalledWith(fakeCompletion);
    expect(commitMessage).toBe(fakeCompletion);
  });
});
