# @commit-generator/prompt-parser

This package provides utilities for converting structured templates into AI-friendly prompts for **Commit Generator**.

## Installation

To use this package in your project, install it as a dependency:

```bash
pnpm install @commit-generator/prompt-parser
```

## Usage

Below is an example of how to use the `PromptParser` to generate a commit message prompt:

```javascript
import { promptParser } from '@commit-generator/prompt-parser';

interface ICommitInfo {
  diff: string;
  type?: string;
  context?: string;
  previousLogs?: string;
}

const template = `
[Intro]
You are an AI specialized in generating commit messages following good practices, 
such as the Conventional Commits format (type(scope): description).

[Rules]
Rules: 
  1. Identify the type of change (feat, fix, chore, refactor, docs, test) based on the diff.
  2. Generate one commit message only.
  3. Don't generate something more than one commit message

[Output]
Expected output:
  <type>(scope): <description>

[Examples][Optional]
{previousLogs}

[Input][Optional]
Type: {type}
Context: {context}

[Input]
Diff: {diff}
`;

export function generatePrompt(commitInfo: ICommitInfo): string {
  const prompt = promptParser.parse(template, { ...commitInfo });
  return prompt.toString();
}
```

## License

This package is licensed under the MIT License.