interface PromptProps {
  intro: string;
  rules: string;
  output: string;
  examples: string;
  inputs: string[];
}

export default class Prompt {
  private intro: string;
  private rules: string;
  private output: string;
  private examples: string;
  private inputs: string[] = [];

  constructor(props: PromptProps) {
    this.intro = props.intro;
    this.rules = props.rules;
    this.output = props.output;
    this.examples = props.examples;
    this.inputs = props.inputs;
  }

  public toString(): string {
    let output: string = '';

    if (this.intro) {
      output += this.intro + '\n\n';
    }

    if (this.rules) {
      output += this.rules + '\n\n';
    }

    if (this.output) {
      output += this.output + '\n\n';
    }

    if (this.examples) {
      output += 'Examples:\n';
      output += this.examples + '\n\n';
    }

    if (this.inputs.length > 0) {
      output += 'Inputs:\n';
      for (const input of this.inputs) {
        output += `  - ${input}\n`;
      }
    }

    return output.trim();
  }
}
