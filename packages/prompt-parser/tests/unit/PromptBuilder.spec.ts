import Prompt from '@/Prompt';
import PromptBuilder from '@/PromptBuilder';
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
      `This is an introduction.\n\n1. Follow the rules.\n2. Be concise.\n\nExpected output format:\n\nExamples:\nExample: Input -> Output\n\nInputs:\n  - Input 1\n  - Input 2\n  - Optional Input 3`,
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
      `Intro text.\n\nRules here.\n\nOutput info.\n\nExamples:\nExamples here.\n\nInputs:\n  - Input 1`,
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
    expect(prompt.toString()).toBe(`Intro only.`);
  });

  it('should reset instance values after building', () => {
    const builder = new PromptBuilder();

    const prompt = builder
      .addIntro('Intro only.')
      .addRules('')
      .addOutput('')
      .addExamples('')
      .build();

    expect(prompt).toBeInstanceOf(Prompt);
    expect(prompt.toString()).toBe(`Intro only.`);

    const newPrompt = builder.build();

    expect(prompt).toBeInstanceOf(Prompt);
    expect(newPrompt.toString()).toBe('');
  });
});
