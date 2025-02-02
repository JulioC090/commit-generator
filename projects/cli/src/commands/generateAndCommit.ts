import { historyPath } from '@/constants';
import editLine from '@/utils/editLine';
import configManager from '@commit-generator/config';
import { createGenerateCommit } from '@commit-generator/core';
import { git } from '@commit-generator/git';

export default async function generateAndCommit(options: {
  type?: string;
  force?: boolean;
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
