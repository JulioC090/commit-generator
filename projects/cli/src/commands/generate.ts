import configManager from '@/config';
import { historyPath } from '@/constants';
import { createGenerateCommit } from '@commit-generator/core';

export default async function generate(options: {
  type?: string;
  context?: string;
}) {
  const config = await configManager.loadConfig();

  if (!config.provider || !config[config.provider as string]) {
    throw new Error(`Invalid provider: ${config.provider ?? 'unknown'}`);
  }

  const generateCommitConfig = {
    provider: config.provider as string,
    params: config[config.provider as string] as { [key: string]: unknown },
  };

  const generateCommit = createGenerateCommit(
    generateCommitConfig,
    historyPath,
    config.excludeFiles as Array<string>,
  );

  console.log(await generateCommit.execute(options));
}
