import { historyPath } from '@/cli/constants';
import configManager from '@/config';
import AddHistory from '@/core/actions/AddHistory';
import GenerateCommit from '@/core/actions/GenerateCommit';
import OpenAICommitGenerator from '@/core/commit-generator/OpenAICommitGenerator';
import git from '@/git';

export default async function generate(options: { type: string }) {
  const config = await configManager.loadConfig();

  const addHistory = new AddHistory({ historyPath });

  const commitGenerator = new OpenAICommitGenerator(
    (config.openaiKey as string) ?? '',
  );

  const generateCommit = new GenerateCommit({
    commitGenerator,
    git,
    excludeFiles: config.excludeFiles as Array<string>,
    addHistory,
  });

  console.log(await generateCommit.execute(options));
}
