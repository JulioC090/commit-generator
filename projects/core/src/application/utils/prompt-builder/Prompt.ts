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
    let output = this.intro + '\n\n';
    output += this.rules + '\n\n';
    output += this.output + '\n\n';
    output += this.examples + '\n\n';
    output += 'Inputs:\n';
    for (const input of this.inputs) {
      output += `  - ${input}\n`;
    }
    return output.trim();
  }
}
