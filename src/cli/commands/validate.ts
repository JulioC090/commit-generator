import { historyPath } from '@/cli/constants';
import configManager from '@/config';
import AddHistory from '@/core/actions/AddHistory';
import ValidateCommit from '@/core/actions/ValidateCommit';
import OpenAICommitValidator from '@/core/commit-validator/OpenAICommitValidator';
import git from '@/git';

export default async function validate(commitMessage?: string) {
  const config = await configManager.loadConfig();

  const addHistory = new AddHistory({ historyPath });

  const commitValidator = new OpenAICommitValidator(
    (config.openaiKey as string) ?? '',
  );

  const validateCommit = new ValidateCommit({
    addHistory,
    git,
    commitValidator,
    excludeFiles: config.excludeFiles as Array<string>,
  });

  const result = await validateCommit.execute({ commitMessage });

  if (result.isValid) {
    console.log('Commit message is valid.');
  } else {
    console.log('Commit message is not valid');
  }
  console.log(`Analysis: ${result.analysis}`);
  console.log(`Recommended commit message: ${result.recommendedMessage}`);
}
