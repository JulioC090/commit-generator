import configManager from '@/config';
import { historyPath } from '@/constants';
import { createGenerateCommit } from '@commit-generator/core';

export default async function generate(options: {
  type?: string;
  context?: string;
}) {
  const config = await configManager.loadConfig();

  if (!config.provider || !config[config.provider]) {
    throw new Error(`Invalid provider: ${config.provider ?? 'unknown'}`);
  }

  const generateCommitConfig = {
    provider: config.provider,
    params: config[config.provider]!,
  };

  const generateCommit = createGenerateCommit(
    generateCommitConfig,
    historyPath,
    config.exclude?.files ?? [],
  );

  console.log(await generateCommit.execute(options));
}
