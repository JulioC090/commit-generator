import { historyPath } from '@/cli/constants';
import configManager from '@/config';
import createValidateCommit from '@/core/factories/createValidateCommit';

export default async function validate(commitMessage?: string) {
  const config = await configManager.loadConfig();

  const validateCommit = createValidateCommit(
    { key: (config.openaiKey as string) ?? '' },
    historyPath,
    config.excludeFiles as Array<string>,
  );

  const result = await validateCommit.execute({ commitMessage });

  if (result.isValid) {
    console.log('Commit message is valid.');
  } else {
    console.log('Commit message is not valid');
  }
  console.log(`Analysis: ${result.analysis}`);
  console.log(`Recommended commit message: ${result.recommendedMessage}`);
}
