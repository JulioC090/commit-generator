import inquirer from 'inquirer';

export default async function promptCommitType(): Promise<string> {
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

  return commitType;
}
