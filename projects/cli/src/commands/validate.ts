import configManager from '@/config';
import { historyPath } from '@/constants';
import wrapText from '@/utils/wrapText';
import { createValidateCommit } from '@commit-generator/core';
import chalk from 'chalk';

export default async function validate(commitMessage?: string) {
  const config = await configManager.loadConfig();

  if (!config.provider || !config[config.provider]) {
    throw new Error(`Invalid provider: ${config.provider ?? 'unknown'}`);
  }

  const validateCommitConfig = {
    provider: config.provider,
    params: config[config.provider]!,
  };

  const validateCommit = createValidateCommit(
    validateCommitConfig,
    historyPath,
    config.excludeFiles ?? [],
  );

  const result = await validateCommit.execute({ commitMessage });

  console.log(
    `${chalk.yellow('🔍 Analysis:\n')}   ${wrapText(result.analysis, 120, 3)}`,
  );

  console.log(
    `\n${chalk.blue('💡 Recommended commit message:\n')}   ${chalk.magenta(result.recommendedMessage)}\n`,
  );

  if (result.isValid) {
    console.log(chalk.green.bold('✅ Commit message is valid.\n'));
  } else {
    console.log(chalk.red('❌ Commit message is not valid'));
    process.exit(1);
  }
}
