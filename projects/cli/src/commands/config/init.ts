import configManager from '@/config';
import promptConfirmConfigOverwrite from '@/prompts/promptConfirmConfigOverwrite';
import promptProvider from '@/prompts/promptProvider';
import promptProviderParams from '@/prompts/promptProviderParams';
import {
  aiModelSchemes,
  IAIModelSchemes,
} from '@commit-generator/core/schemes';
import chalk from 'chalk';

export default async function init(provider?: string) {
  console.clear();

  const providers = Object.keys(aiModelSchemes);

  if (provider && !providers.includes(provider)) {
    console.error(chalk.red.bold(`❌ Provider '${provider}' not found.`));
    process.exit(1);
  }

  const selectedProvider: keyof IAIModelSchemes =
    provider || (await promptProvider(providers));

  const { properties, required } = aiModelSchemes[selectedProvider];

  const providerParams = await promptProviderParams(
    selectedProvider,
    Object.keys(properties),
    required,
  );

  if (!(await promptConfirmConfigOverwrite())) {
    console.clear();
    console.log(chalk.yellow('⚠️  Operation canceled.'));
    process.exit(0);
  }

  await configManager.set('provider', selectedProvider, 'local');
  await configManager.set(selectedProvider, providerParams, 'local');

  console.clear();

  console.log(
    chalk.blue(
      `✅ Configuration for '${selectedProvider}' saved successfully!`,
    ),
  );
}
