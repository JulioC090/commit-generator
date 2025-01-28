import Prompt from '@/core/prompt-builder/Prompt';
import PromptBuilder from '@/core/prompt-builder/PromptBuilder';
import { describe, expect, it } from 'vitest';

describe('PromptBuilder', () => {
  it('should build a Prompt object with the correct values', () => {
    const builder = new PromptBuilder();

    const prompt = builder
      .addIntro('This is an introduction.')
      .addRules('1. Follow the rules.\n2. Be concise.')
      .addOutput('Expected output format:')
      .addExamples('Example: Input -> Output')
      .addInput('Input 1')
      .addInput('Input 2')
      .addOptionalInput('Optional Input 3', true)
      .build();

    expect(prompt).toBeInstanceOf(Prompt);
    expect(prompt.toString()).toBe(
      `This is an introduction.\n1. Follow the rules.\n2. Be concise.\nExpected output format:\nExample: Input -> Output\nInputs:\n  - Input 1\n  - Input 2\n  - Optional Input 3\n`,
    );
  });

  it('should skip optional input if value is falsy', () => {
    const builder = new PromptBuilder();

    const prompt = builder
      .addIntro('Intro text.')
      .addRules('Rules here.')
      .addOutput('Output info.')
      .addExamples('Examples here.')
      .addInput('Input 1')
      .addOptionalInput('Optional Input 2', false)
      .build();

    expect(prompt).toBeInstanceOf(Prompt);
    expect(prompt.toString()).toBe(
      `Intro text.\nRules here.\nOutput info.\nExamples here.\nInputs:\n  - Input 1\n`,
    );
  });

  it('should handle empty inputs gracefully', () => {
    const builder = new PromptBuilder();

    const prompt = builder
      .addIntro('Intro only.')
      .addRules('')
      .addOutput('')
      .addExamples('')
      .build();

    expect(prompt).toBeInstanceOf(Prompt);
    expect(prompt.toString()).toBe(`Intro only.\n\n\n\nInputs:\n`);
  });
});
