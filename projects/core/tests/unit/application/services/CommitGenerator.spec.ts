import IAIModel from '@/application/interfaces/IAIModel';
import ICommitInfo from '@/application/interfaces/ICommitInfo';
import CommitGenerator from '@/application/services/CommitGenerator';
import sanitize from '@/application/utils/sanitizers/sanitize';
import { describe, expect, it, vi } from 'vitest';

vi.mock('@/application/utils/prompts/generatePrompt', () => ({
  generatePrompt: vi.fn(),
}));

vi.mock('@/application/utils/sanitizers/sanitize', () => ({
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
