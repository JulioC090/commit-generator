import OpenAICommitGenerator from '@/commit-generator/OpenAICommitGenerator';
import { execSync } from 'node:child_process';

const commitGenerator = new OpenAICommitGenerator(process.env.OPENAI_KEY!);

async function main() {
  const diff = execSync('git diff --staged').toString();
  const commitMessage = await commitGenerator.generate(diff);
  console.log(commitMessage);
}

main();
