import OpenAICommitGenerator from '@/commit-generator/OpenAICommitGenerator';
import { getStagedDiff, isRepository } from '@/utils/git';

async function main() {
  if (!isRepository()) {
    console.error(
      'Error: The current directory is not a valid Git repository.',
    );
    process.exit(1);
  }

  const diff = getStagedDiff();

  if (!diff) {
    console.error('Error: No staged files found.');
    process.exit(1);
  }

  const commitGenerator = new OpenAICommitGenerator(process.env.OPENAI_KEY!);
  const commitMessage = await commitGenerator.generate(diff);
  console.log(commitMessage);
}

main();
