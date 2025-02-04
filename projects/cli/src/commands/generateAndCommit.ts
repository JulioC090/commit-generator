import { historyPath } from '@/constants';
import configManager from '@commit-generator/config';
import { createGenerateCommit } from '@commit-generator/core';
import { git } from '@commit-generator/git';
import chalk from 'chalk';
import inquirer from 'inquirer';
import ora from 'ora-classic';

export default async function generateAndCommit(options: {
  type?: string;
  force?: boolean;
}) {
  try {
    const config = await configManager.loadConfig();

    if (!options.type && !options.force) {
      const commitTypeChoices = [
        { name: '✨ feat: Introduce a new feature', value: 'feat' },
        { name: '🐛 fix: Fix a bug', value: 'fix' },
        { name: '📝 docs: Update or add documentation', value: 'docs' },
        { name: '💄 style: Code formatting and style changes', value: 'style' },
        {
          name: '♻️  refactor: Code refactoring without changing functionality',
          value: 'refactor',
        },
        { name: '✅ test: Add or update tests', value: 'test' },
        { name: '🔨 chore: Maintenance and chores', value: 'chore' },
        { name: '🚫 None: Do not specify a commit type', value: '' },
      ];

      const { commitType } = await inquirer.prompt([
        {
          type: 'list',
          name: 'commitType',
          message: 'Select the commit type:',
          choices: commitTypeChoices,
        },
      ]);
      options.type = commitType;
    }

    const generateCommit = createGenerateCommit(
      { key: (config.openaiKey as string) ?? '' },
      historyPath,
      config.excludeFiles as Array<string>,
    );

    console.clear();
    const spinner = ora('Generating commit message, please wait...').start();
    let commitMessage = await generateCommit.execute(options);
    spinner.stop();

    if (!options.force) {
      let confirmed = false;
      while (!confirmed) {
        console.clear();
        console.log('\nGenerated commit message:\n');
        console.log(chalk.green.bold(commitMessage));
        console.log('\n');

        const { action } = await inquirer.prompt([
          {
            type: 'list',
            name: 'action',
            message: 'What do you want to do?',
            choices: [
              {
                name: '🔄 Re-generate: Generate a new commit message',
                value: 'regenerate',
              },
              {
                name: '✏️  Edit: Modify the current commit message',
                value: 'edit',
              },
              {
                name: '✅ Commit: Use the current commit message',
                value: 'commit',
              },
              { name: '🚪 Exit: Quit without committing', value: 'exit' },
            ],
          },
        ]);

        switch (action) {
          case 'regenerate':
            console.clear();
            spinner.start();
            commitMessage = await generateCommit.execute(options);
            spinner.stop();
            break;
          case 'edit': {
            const { newMessage } = await inquirer.prompt([
              {
                type: 'editor',
                name: 'newMessage',
                message: 'Enter the new commit message:',
                default: commitMessage,
              },
            ]);
            commitMessage = newMessage;
            break;
          }
          case 'commit':
            confirmed = true;
            break;
          case 'exit':
            console.clear();
            console.log(chalk.blue('Exiting without committing.'));
            return;
        }
      }
    }

    git.commit(commitMessage);
    console.clear();
    console.log(chalk.blue('Commit successful!'));
  } catch (error) {
    console.error(chalk.red('An error occurred:'), (error as Error).message);
  }
}
