import { historyPath } from '@/cli/constants';
import CommandLineInteractor from '@/cli/user-interactor/CommandLineInteractor';
import configManager from '@/config';
import AddHistory from '@/core/actions/AddHistory';
import GenerateAndCommit from '@/core/actions/GenerateAndCommit';
import GenerateCommit from '@/core/actions/GenerateCommit';
import OpenAICommitGenerator from '@/core/commit-generator/OpenAICommitGenerator';
import git from '@/git';

export default async function generateAndCommit(options: {
  type: string;
  force: boolean;
}) {
  const config = await configManager.loadConfig();

  const addHistory = new AddHistory({ historyPath });

  const commitGenerator = new OpenAICommitGenerator(
    (config.openaiKey as string) ?? '',
  );
  const userInteractor = new CommandLineInteractor();

  const generateCommit = new GenerateCommit({
    userInteractor,
    commitGenerator,
    git,
    excludeFiles: config.excludeFiles as Array<string>,
    addHistory,
  });

  const generateAndCommit = new GenerateAndCommit({ generateCommit, git });

  await generateAndCommit.execute(options);
}
