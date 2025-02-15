import configManager from '@/config';
import { historyPath } from '@/constants';
import promptCommitContext from '@/prompts/promptCommitContext';
import promptCommitType from '@/prompts/promptCommitType';
import promptInteractiveGeneration from '@/prompts/promptInterativeGeneration';
import checkStagedFiles from '@/utils/checkStagedFiles';
import { createGenerateCommit } from '@commit-generator/core';
import { git } from '@commit-generator/git';
import chalk from 'chalk';
import ora from 'ora-classic';

export default async function generateAndCommit(options: {
  type?: string;
  context?: string;
  force?: boolean;
}) {
  const spinner = ora('Generating commit message, please wait...');

  try {
    const config = await configManager.loadConfig();

    if (!config.provider || !config[config.provider]) {
      throw new Error(`Invalid provider: ${config.provider ?? 'unknown'}`);
    }

    await checkStagedFiles(config.exclude?.files ?? [], options.force);

    if (!options.type && !options.force) {
      options.type = await promptCommitType();
    }

    if (!options.context && !options.force) {
      options.context = await promptCommitContext();
    }

    const generateCommitConfig = {
      provider: config.provider,
      params: config[config.provider]!,
    };

    const generateCommit = createGenerateCommit(
      generateCommitConfig,
      historyPath,
      config.exclude?.files ?? [],
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
