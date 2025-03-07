import { historyPath } from '@/constants';
import { CommitHistory } from '@commit-generator/commit-history';
import chalk from 'chalk';
import inquirer from 'inquirer';
import ora from 'ora-classic';

export default async function promptInteractiveGeneration(
  generateCommit: () => Promise<string>,
  initialMessage: string,
) {
  const commitHistory = new CommitHistory(historyPath);

  let commitMessage = initialMessage;
  let confirmed = false;
  const spinner = ora('Generating commit message, please wait...');

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
        try {
          console.clear();
          spinner.start();
          commitMessage = await generateCommit();
        } catch (error) {
          console.clear();
          console.error(
            chalk.red('An error occurred:'),
            (error as Error).message,
          );
        } finally {
          spinner.stop();
        }
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
        commitHistory.add(commitMessage);
        break;
      }
      case 'commit':
        confirmed = true;
        break;
      case 'exit':
        console.clear();
        console.log(chalk.blue('Exiting without committing.'));
        process.exit(0);
    }
  }
  return commitMessage;
}
