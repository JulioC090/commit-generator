import inquirer from 'inquirer';

export default async function promptProvider(providers: Array<string>) {
  const { provider } = await inquirer.prompt([
    {
      type: 'list',
      name: 'provider',
      message: 'Escolha o provedor de IA:',
      choices: providers,
    },
  ]);

  return provider;
}
