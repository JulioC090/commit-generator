import { historyPath } from '@/cli/constants';
import editLine from '@/cli/utils/editLine';
import configManager from '@/config';
import AddHistory from '@/core/actions/AddHistory';
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

  const generateCommit = new GenerateCommit({
    commitGenerator,
    git,
    excludeFiles: config.excludeFiles as Array<string>,
    addHistory,
  });

  const commit = await generateCommit.execute(options);

  let finalCommit = commit;

  if (!options.force) {
    finalCommit = await editLine(commit);
  }

  git.commit(finalCommit);
}
