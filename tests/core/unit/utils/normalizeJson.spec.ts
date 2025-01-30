import normalizeJson from '@/core/utils/normalizeJson';
import { describe, expect, it } from 'vitest';

describe('normalizeJson', () => {
  it('should normalize a JSON string with missing quotes around keys', () => {
    const input = `{
      isValid: true,
      recommendedMessage: "feat(cli): add validate command for commit message validation",
      analysis: "The commit message follows the Conventional Commits format. It identifies the type as 'feat', specifies the scope as 'cli', and provides a concise description of the new feature being added, which is appropriate given the context of the diff where a new command for validation is added to the CLI."
    }`;

    const expectedOutput = `{
      "isValid": true,
      "recommendedMessage": "feat(cli): add validate command for commit message validation",
      "analysis": "The commit message follows the Conventional Commits format. It identifies the type as 'feat', specifies the scope as 'cli', and provides a concise description of the new feature being added, which is appropriate given the context of the diff where a new command for validation is added to the CLI."
    }`;

    const result = normalizeJson(input);

    expect(result).toBe(expectedOutput);
    expect(JSON.parse(result)).toEqual({
      isValid: true,
      recommendedMessage:
        'feat(cli): add validate command for commit message validation',
      analysis:
        "The commit message follows the Conventional Commits format. It identifies the type as 'feat', specifies the scope as 'cli', and provides a concise description of the new feature being added, which is appropriate given the context of the diff where a new command for validation is added to the CLI.",
    });
  });

  it('should handle an already correctly formatted JSON string', () => {
    const input = `{
      "isValid": true,
      "recommendedMessage": "feat(cli): add validate command for commit message validation",
      "analysis": "The commit message follows the Conventional Commits format."
    }`;

    const result = normalizeJson(input);

    expect(result).toBe(input);
    expect(JSON.parse(result)).toEqual({
      isValid: true,
      recommendedMessage:
        'feat(cli): add validate command for commit message validation',
      analysis: 'The commit message follows the Conventional Commits format.',
    });
  });

  it('should handle empty strings gracefully', () => {
    const input = '';
    const result = normalizeJson(input);
    expect(result).toBe('');
  });
});
