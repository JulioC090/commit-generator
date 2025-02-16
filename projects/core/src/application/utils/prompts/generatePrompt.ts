import ICommitInfo from '@/application/interfaces/ICommitInfo';
import { promptParser } from '@commit-generator/prompt-parser';

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
