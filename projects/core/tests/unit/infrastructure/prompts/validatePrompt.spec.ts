import validatePrompt from '@/infrastructure/ai/prompts/validatePrompt';
import { describe, expect, it } from 'vitest';

describe('validatePrompt', () => {
  it('should generate a structured prompt', () => {
    const commitMessage = 'feat(auth): add login validation';
    const commitInfo = { diff: 'add login diff' };

    const prompt = validatePrompt(commitMessage, commitInfo);

    expect(prompt).toContain(
      'You are an AI specialized in generating commit messages',
    );
    expect(prompt).toContain('Rules:');
    expect(prompt).toContain('Expected output:');
    expect(prompt).toContain(`Commit: "${commitMessage}"`);
    expect(prompt).toContain(`Diff: ${commitInfo.diff}`);
  });
});
