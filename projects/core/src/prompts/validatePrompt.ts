import ICommitInfo from '@/types/ICommitInfo';
import { promptParser } from '@commit-generator/prompt-parser';

const template = `
[Intro]
You are an AI specialized in generating commit messages following good practices, 
such as the Conventional Commits format (type(scope): description).

[Rules]
Rules: 
  1. I will send you a commit message and additional information 
  2. Your duty is to analyze this information 
  3. Respond if this commit is valid, that is, it follows all the desired rules 
  4. Generate the commit that would be ideal

[Output]
Expected output:
  {
    isValid: boolean,
    recommendedMessage: "<type>(scope): <description>",
    analysis: string
  }

[Input]
Commit: "{commitMessage}"
Diff: {diff}
`;

export default function validatePrompt(
  commitMessage: string,
  { diff }: ICommitInfo,
) {
  const prompt = promptParser.parse(template, {
    commitMessage,
    diff,
  });

  return prompt.toString();
}
