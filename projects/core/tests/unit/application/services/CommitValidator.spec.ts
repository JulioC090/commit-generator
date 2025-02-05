import IAIModel from '@/application/interfaces/IAIModel';
import ICommitInfo from '@/application/interfaces/ICommitInfo';
import CommitValidator from '@/application/services/CommitValidator';
import normalizeJson from '@/application/utils/sanitizers/normalizeJson';
import sanitize from '@/application/utils/sanitizers/sanitize';
import { describe, expect, it, vi } from 'vitest';

vi.mock('@/application/utils/prompts/validatePrompt', () => ({
  default: vi.fn(),
}));

vi.mock('@/application/utils/sanitizers/normalizeJson', () => ({
  default: vi.fn(),
}));

vi.mock('@/application/utils/sanitizers/sanitize', () => ({
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
