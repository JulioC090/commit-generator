import Prompt from '@/prompt-builder/Prompt';
import { describe, expect, it } from 'vitest';

describe('Prompt', () => {
  it('should correctly format the output of toString()', () => {
    const props = {
      intro: 'This is an introduction.',
      rules: '1. Follow the rules.\n2. Be concise.',
      output: 'Expected output format:',
      examples: 'Example: Input -> Output',
      inputs: ['Input 1', 'Input 2', 'Input 3'],
    };

    const prompt = new Prompt(props);

    const expectedOutput = `This is an introduction.\n1. Follow the rules.\n2. Be concise.\nExpected output format:\nExample: Input -> Output\nInputs:\n  - Input 1\n  - Input 2\n  - Input 3\n`;

    expect(prompt.toString()).toBe(expectedOutput);
  });

  it('should handle empty inputs array gracefully', () => {
    const props = {
      intro: 'Intro text.',
      rules: 'Rules here.',
      output: 'Output info.',
      examples: 'Examples here.',
      inputs: [],
    };

    const prompt = new Prompt(props);

    const expectedOutput = `Intro text.\nRules here.\nOutput info.\nExamples here.\nInputs:\n`;

    expect(prompt.toString()).toBe(expectedOutput);
  });
});
