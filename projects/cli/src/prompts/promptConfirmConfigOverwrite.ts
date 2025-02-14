import inquirer from 'inquirer';

export default async function promptConfirmConfigOverwrite() {
  const { confirm } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'confirm',
      message:
        'This will overwrite existing configurations. Do you want to continue?',
      default: true,
    },
  ]);

  return confirm;
}
