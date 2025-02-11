import configManager from '@/config';
import { historyPath } from '@/constants';
import { createGenerateCommit } from '@commit-generator/core';

export default async function generate(options: {
  type?: string;
  context?: string;
}) {
  const config = await configManager.loadConfig();

  const generateCommitConfig = {
    provider: 'openai',
    params: {
      key: (config.openaiKey as string) ?? '',
    },
  };

  const generateCommit = createGenerateCommit(
    generateCommitConfig,
    historyPath,
    config.excludeFiles as Array<string>,
  );

  console.log(await generateCommit.execute(options));
}
