import OpenAICommitGenerator from '@/commit-generator/OpenAICommitGenerator';
import configManager from '@/config';
import CommandLineInteractor from '@/user-interactor/CommandLineInteractor';
import IUserInteractor from '@/user-interactor/IUserInteractor';
import { exitWithError } from '@/utils/errorHandler';
import { getDiff, isRepository, makeCommit } from '@/utils/git';

interface GenerateCommitProps {
  force?: boolean;
  type?: string;
}

const userInteractor: IUserInteractor = new CommandLineInteractor();

export default async function generateCommit(options: GenerateCommitProps) {
  if (!isRepository()) {
    exitWithError(
      'Error: The current directory is not a valid Git repository.',
    );
  }

  const config = await configManager.loadConfig();

  const diff = getDiff({
    staged: true,
    excludeFiles: (config.excludeFiles as Array<string>) ?? null,
  });

  if (!diff) {
    exitWithError('Error: No staged files found.');
  }

  const commitGenerator = new OpenAICommitGenerator(
    (config.openaiKey as string) ?? '',
  );
  const commitMessage = await commitGenerator.generate({
    diff,
    type: options.type,
  });

  let finalCommit = commitMessage;

  if (!options.force) {
    finalCommit = await userInteractor.confirmCommitMessage(commitMessage);
  }

  makeCommit(finalCommit);
}
