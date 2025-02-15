import inquirer from 'inquirer';

export default async function promptConfirmStage() {
  const { confirm } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'confirm',
      message: 'You have no files staged. Would you like to add all files?',
      default: true,
    },
  ]);

  return confirm;
}
