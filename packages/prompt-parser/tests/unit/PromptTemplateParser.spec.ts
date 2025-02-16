import PromptBuilder from '@/PromptBuilder';
import PromptTemplateParser from '@/PromptTemplateParser';
import { describe, expect, it } from 'vitest';

describe('PromptTemplateParser', () => {
  it('should parse a template and extract sections correctly', () => {
    const parser = new PromptTemplateParser(new PromptBuilder());

    const template = `
[Intro]
This is a test intro.
And this is other line.

[Rules]
Follow the rules strictly.

[Output]
Expected result format.

[Examples]
Example 1: Input -> Output

[Input]
User input: {inputValue}
`;

    const expected = `
This is a test intro.
And this is other line.

Follow the rules strictly.

Expected result format.

Examples:
Example 1: Input -> Output

Inputs:
  - User input: Test Input
    `.trim();

    const variables = { inputValue: 'Test Input' };
    const prompt = parser.parse(template, variables);

    expect(prompt.toString()).toBe(expected);
  });

  it('should replace variables in the template', () => {
    const parser = new PromptTemplateParser(new PromptBuilder());

    const template = `
      [Input]
      Variable test: {testVar}
    `;

    const variables = { testVar: 'Success' };
    const prompt = parser.parse(template, variables);

    expect(prompt.toString()).toContain('Variable test: Success');
  });

  it('should throw an error if a required variable is missing', () => {
    const parser = new PromptTemplateParser(new PromptBuilder());

    const template = `
      [Input]
      Required variable: {missingVar}
    `;

    expect(() => parser.parse(template, {})).toThrow(
      'missingVar is not defined',
    );
  });

  it('should handle optional sections correctly', () => {
    const parser = new PromptTemplateParser(new PromptBuilder());

    const template = `
      [Intro][Optional]
      Optional value: {optionalVar}
    `;

    const variables = {};
    const prompt = parser.parse(template, variables);

    expect(prompt.toString()).not.toContain('Optional value:');
  });

  it('should throw an error for invalid sections', () => {
    const parser = new PromptTemplateParser(new PromptBuilder());

    const template = `
      [InvalidSection]
      This section does not exist.
    `;

    expect(() => parser.parse(template, {})).toThrow('Invalid Section');
  });
});
