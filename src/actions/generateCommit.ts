import OpenAICommitGenerator from '@/commit-generator/OpenAICommitGenerator';
import configManager from '@/config';
import { exitWithError } from '@/utils/errorHandler';
import { getDiff, isRepository, makeCommit } from '@/utils/git';
import readline from 'node:readline/promises';

interface GenerateCommitProps {
  staged?: boolean;
  force?: boolean;
  type?: string;
}

export default async function generateCommit(options: GenerateCommitProps) {
  if (!isRepository()) {
    exitWithError(
      'Error: The current directory is not a valid Git repository.',
    );
  }

  const config = await configManager.loadConfig();

  const diff = getDiff({
    staged: options.staged,
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
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    const rlPromise = rl.question('Confirm Commit Message: ');
    rl.write(commitMessage);
    finalCommit = await rlPromise;

    rl.close();
  }

  makeCommit(finalCommit);
}
