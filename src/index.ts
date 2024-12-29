import OpenAICommitGenerator from '@/commit-generator/OpenAICommitGenerator';
import { getStagedDiff } from '@/utils/git';

const commitGenerator = new OpenAICommitGenerator(process.env.OPENAI_KEY!);

async function main() {
  const diff = getStagedDiff();
  const commitMessage = await commitGenerator.generate(diff);
  console.log(commitMessage);
}

main();
