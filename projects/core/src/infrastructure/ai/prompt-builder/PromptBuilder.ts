import Prompt from '@/infrastructure/ai/prompt-builder/Prompt';

export default class PromptBuilder {
  private intro: string = '';
  private rules: string = '';
  private output: string = '';
  private examples: string = '';
  private inputs: string[] = [];

  public addIntro(intro: string): PromptBuilder {
    this.intro = intro.trim();
    return this;
  }

  public addRules(rules: string): PromptBuilder {
    this.rules = rules.trim();
    return this;
  }

  public addOutput(output: string): PromptBuilder {
    this.output = output.trim();
    return this;
  }

  public addExamples(examples: string): PromptBuilder {
    this.examples = examples.trim();
    return this;
  }

  public addInput(input: string): PromptBuilder {
    this.inputs.push(input.trim());
    return this;
  }

  public addOptionalInput(input: string, value: unknown): PromptBuilder {
    if (value) {
      this.inputs.push(input.trim());
    }

    return this;
  }

  public build(): Prompt {
    return new Prompt({
      intro: this.intro,
      rules: this.rules,
      output: this.output,
      examples: this.examples,
      inputs: this.inputs,
    });
  }
}
