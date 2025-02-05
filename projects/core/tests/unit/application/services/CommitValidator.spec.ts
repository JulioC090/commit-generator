import IAIModel from '@/application/interfaces/IAIModel';
import ICommitInfo from '@/application/interfaces/ICommitInfo';
import CommitValidator from '@/application/services/CommitValidator';
import normalizeJson from '@/infrastructure/ai/sanitizers/normalizeJson';
import sanitize from '@/infrastructure/ai/sanitizers/sanitize';
import { describe, expect, it, vi } from 'vitest';

vi.mock('@/infrastructure/ai/prompts/validatePrompt', () => ({
  default: vi.fn(),
}));

vi.mock('@/infrastructure/ai/sanitizers/normalizeJson', () => ({
  default: vi.fn(),
}));

vi.mock('@/infrastructure/ai/sanitizers/sanitize', () => ({
  default: vi.fn(),
}));

describe('CommitValidator', () => {
  it('should validate a commit message using the AI model', async () => {
    const fakeCommitMessage = 'Fake commit message';
    const fakeCommitInfo: ICommitInfo = {
      diff: 'some diff',
      type: 'type',
      previousLogs: 'logs',
    };
    const fakeAIResponse = '{"isValid": true}';
    const mockAIModel = {
      complete: vi.fn().mockResolvedValue(fakeAIResponse),
    } as unknown as IAIModel;

    vi.mocked(sanitize).mockReturnValue(fakeAIResponse);
    vi.mocked(normalizeJson).mockReturnValue(fakeAIResponse);

    const commitValidator = new CommitValidator(mockAIModel);

    const validationResult = await commitValidator.validate(
      fakeCommitMessage,
      fakeCommitInfo,
    );

    expect(mockAIModel.complete).toHaveBeenCalledTimes(1);
    expect(sanitize).toHaveBeenCalledWith(fakeAIResponse);
    expect(normalizeJson).toHaveBeenCalledWith(fakeAIResponse);
    expect(validationResult).toEqual({ isValid: true });
  });

  it('should throw an error if AI response is invalid', async () => {
    const fakeCommitMessage = 'Fake commit message';
    const fakeCommitInfo: ICommitInfo = {
      diff: 'some diff',
      type: 'type',
      previousLogs: 'logs',
    };
    const fakeAIResponse = 'invalid json';
    const mockAIModel = {
      complete: vi.fn().mockResolvedValue(fakeAIResponse),
    } as unknown as IAIModel;

    vi.mocked(sanitize).mockReturnValue(fakeAIResponse);
    vi.mocked(normalizeJson).mockReturnValue(fakeAIResponse);

    const commitValidator = new CommitValidator(mockAIModel);

    await expect(
      commitValidator.validate(fakeCommitMessage, fakeCommitInfo),
    ).rejects.toThrow('Invalid AI response: invalid json');
  });
});
