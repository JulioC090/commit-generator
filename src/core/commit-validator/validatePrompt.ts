import PromptBuilder from '@/core/prompt-builder/PromptBuilder';
import ICommitInfo from '@/core/types/ICommitInfo';

export default function validatePrompt(
  commitMessage: string,
  { diff }: ICommitInfo,
) {
  return new PromptBuilder()
    .addIntro(
      `
    You are an AI specialized in generating commit messages following good practices, 
    such as the Conventional Commits format (type(scope): description).
  `,
    )
    .addRules(
      `
    Rules: 
      1. I will send you a commit message and additional information 
      2. Your duty is to analyze this information 
      3. Respond if this commit is valid, that is, it follows all the desired rules 
      4. Generate the commit that would be ideal
  `,
    )
    .addOutput(
      `
    Expected output:
    {
      isValid: boolean,
      recommendedMessage: "<type>(scope): <description>",
      analysis: string
    }
    `,
    )
    .addInput('Input:')
    .addInput(`Commit: "${commitMessage}"`)
    .addInput(`Diff: ${diff}`)
    .build()
    .toString();
}
