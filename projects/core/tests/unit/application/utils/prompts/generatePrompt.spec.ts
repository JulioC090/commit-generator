import { generatePrompt } from '@/application/utils/prompts/generatePrompt';
import { describe, expect, it } from 'vitest';

describe('generatePrompt', () => {
  it('should generate a prompt with all provided inputs', () => {
    const diff = 'Added new functionality to the login module';
    const type = 'feat';
    const context = 'Improve security';
    const previousLogs =
      'feat(auth): added login endpoint\nfix(auth): resolved login issue';

    const result = generatePrompt({ diff, type, context, previousLogs });

    expect(result.includes(diff)).toBeTruthy();
    expect(result.includes('Type: ' + type)).toBeTruthy();
    expect(result.includes('Context: ' + context)).toBeTruthy();
    expect(result.includes(previousLogs)).toBeTruthy();
  });

  it('should generate a prompt without previous logs when not provided', () => {
    const diff = 'Fixed a bug in the payment module';
    const type = 'fix';
    const previousLogs = undefined;

    const result = generatePrompt({ diff, type, previousLogs });

    expect(result.includes(diff)).toBeTruthy();
    expect(result.includes('Type: ' + type)).toBeTruthy();
    expect(result.includes('Examples:')).toBeFalsy();
  });

  it('should generate a prompt without type when not provided', () => {
    const diff = 'Refactored the user profile module';
    const type = undefined;
    const previousLogs =
      'refactor(user): cleaned up user module\nfeat(profile): added profile picture upload';

    const result = generatePrompt({ diff, type, previousLogs });

    expect(result.includes(diff)).toBeTruthy();
    expect(result.includes('Type: ')).toBeFalsy();
    expect(result.includes(previousLogs)).toBeTruthy();
  });
});
