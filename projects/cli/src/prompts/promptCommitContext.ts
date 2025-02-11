import inquirer from 'inquirer';

export default async function promptCommitContext() {
  const { context } = await inquirer.prompt([
    {
      type: 'input',
      name: 'context',
      message: 'Provide additional context for the commit (optional):',
    },
  ]);

  return context.trim();
}
