import inquirer, { Answers } from 'inquirer';

export default async function promptProviderParams(
  provider: string,
  properties: Array<string>,
  required: Array<string>,
) {
  const providerPrompt = properties.map((key) => ({
    type: key === 'key' ? 'password' : 'input',
    name: key,
    mask: true,
    message: `Enter ${provider} ${key}:`,
    validate: (input: string) => {
      if (required.includes(key) && !input.trim()) {
        return 'Required Field';
      }
      return true;
    },
  }));

  return await inquirer.prompt(providerPrompt as Answers);
}
