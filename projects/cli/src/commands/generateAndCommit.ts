import { historyPath } from '@/constants';
import promptCommitType from '@/prompts/promptCommitType';
import promptInteractiveGeneration from '@/prompts/promptInterativeGeneration';
import configManager from '@commit-generator/config';
import { createGenerateCommit } from '@commit-generator/core';
import { git } from '@commit-generator/git';
import chalk from 'chalk';
import ora from 'ora-classic';

export default async function generateAndCommit(options: {
  type?: string;
  force?: boolean;
}) {
  const spinner = ora('Generating commit message, please wait...');

  try {
    const config = await configManager.loadConfig();

    if (!options.type && !options.force) {
      options.type = await promptCommitType();
    }

    const generateCommit = createGenerateCommit(
      { key: (config.openaiKey as string) ?? '' },
      historyPath,
      config.excludeFiles as Array<string>,
    );

    console.clear();
    spinner.start();
    let commitMessage = await generateCommit.execute(options);
    spinner.stop();

    if (!options.force) {
      commitMessage = await promptInteractiveGeneration(
        async () => await generateCommit.execute(options),
        commitMessage,
      );
    }

    git.commit(commitMessage);
    console.clear();
    console.log(chalk.blue('Commit successful!'));
  } catch (error) {
    spinner.stop();
    console.clear();
    console.error(chalk.red('An error occurred:'), (error as Error).message);
  }
}
