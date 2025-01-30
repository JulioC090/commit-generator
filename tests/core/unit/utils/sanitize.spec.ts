import sanitize from '@/core/utils/sanitize';
import { describe, expect, it } from 'vitest';

describe('sanitize', () => {
  it('should remove ```json and ``` from a formatted response', () => {
    const response = `\`\`\`json
    {
      "isValid": true,
      "recommendedMessage": "feat(auth): add login validation",
      "analysis": "The commit follows the best practices"
    }
    \`\`\``;

    expect(sanitize(response)).toBe(
      `{
      "isValid": true,
      "recommendedMessage": "feat(auth): add login validation",
      "analysis": "The commit follows the best practices"
    }`.trim(),
    );
  });

  it('should remove ``` from a formatted response', () => {
    const response = `\`\`\`
    {
      "isValid": false,
      "recommendedMessage": "fix: correct login bug",
      "analysis": "Message does not follow the proper format"
    }
    \`\`\``;

    expect(sanitize(response)).toBe(
      `{
      "isValid": false,
      "recommendedMessage": "fix: correct login bug",
      "analysis": "Message does not follow the proper format"
    }`.trim(),
    );
  });

  it('should return the response unchanged if no formatting is present', () => {
    const response = `{
      "isValid": true,
      "recommendedMessage": "feat: improve performance",
      "analysis": "Good commit message"
    }`;

    expect(sanitize(response)).toBe(response.trim());
  });

  it('should throw an error if response is empty', () => {
    expect(() => sanitize('')).toThrow('Invalid AI response');
  });

  it('should throw an error if response is not a string', () => {
    expect(() => sanitize(null as unknown as string)).toThrow(
      'Invalid AI response',
    );
    expect(() => sanitize(undefined as unknown as string)).toThrow(
      'Invalid AI response',
    );
    expect(() => sanitize(42 as unknown as string)).toThrow(
      'Invalid AI response',
    );
  });
});
