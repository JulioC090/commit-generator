import { historyPath } from '@/cli/constants';
import editLine from '@/cli/utils/editLine';
import configManager from '@/config';
import createGenerateCommit from '@/core/factories/createGenerateCommit';
import git from '@/git';

export default async function generateAndCommit(options: {
  type: string;
  force: boolean;
}) {
  const config = await configManager.loadConfig();

  const generateCommit = createGenerateCommit(
    { key: (config.openaiKey as string) ?? '' },
    historyPath,
    config.excludeFiles as Array<string>,
  );

  const commit = await generateCommit.execute(options);

  let finalCommit = commit;

  if (!options.force) {
    finalCommit = await editLine(commit);
  }

  git.commit(finalCommit);
}
