import configManager from '@/config';
import { historyPath } from '@/constants';
import { createGenerateCommit } from '@commit-generator/core';

export default async function generate(options: { type?: string }) {
  const config = await configManager.loadConfig();

  const generateCommit = createGenerateCommit(
    { key: (config.openaiKey as string) ?? '' },
    historyPath,
    config.excludeFiles as Array<string>,
  );

  console.log(await generateCommit.execute(options));
}
