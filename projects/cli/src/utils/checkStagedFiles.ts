import promptConfirmStage from '@/prompts/promptConfirmStage';
import { git } from '@commit-generator/git';
import chalk from 'chalk';

export default async function checkStagedFiles(
  excludeFiles: Array<string>,
  force?: boolean,
) {
  const diff = git.diff({
    staged: true,
    excludeFiles,
  });

  if (diff) {
    return;
  }

  if (force) {
    console.log(chalk.red('No staged files found.'));
    process.exit(1);
  }

  const confirm = await promptConfirmStage();

  if (!confirm) {
    console.log(chalk.red('No staged files found.'));
    process.exit(1);
  }

  git.add();

  const newDiff = git.diff({
    staged: true,
    excludeFiles,
  });

  if (!newDiff) {
    console.log(chalk.red('No staged files found.'));
    process.exit(1);
  }
}
