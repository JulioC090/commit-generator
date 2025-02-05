import ICommitInfo from '@/application/interfaces/ICommitInfo';
import PromptBuilder from '@/application/utils/prompt-builder/PromptBuilder';

export function generatePrompt({
  diff,
  type,
  previousLogs,
}: ICommitInfo): string {
  const promptBuilder = new PromptBuilder()
    .addIntro(
      `
    You are an AI specialized in generating commit messages following good practices, 
    such as the Conventional Commits format (type(scope): description).
  `,
    )
    .addRules(
      `
    Rules: 
      1. Identify the type of change (feat, fix, chore, refactor, docs, test) based on the diff.
      2. Generate one commit message only.
      3. Don't generate something more than one commit message
  `,
    )
    .addOutput(
      `
    Expected output:
    <type>(scope): <description>
  `,
    )
    .addInput('Input:')
    .addOptionalInput(`Type: ${type}`, type)
    .addInput(`Diff: ${diff}`);

  if (previousLogs) {
    promptBuilder.addExamples(`
      Examples:
      ${previousLogs}
    `);
  }

  return promptBuilder.build().toString();
}
