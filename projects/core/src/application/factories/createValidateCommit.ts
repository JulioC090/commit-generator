import CommitValidator from '@/application/services/CommitValidator';
import ValidateCommit from '@/application/use-cases/ValidateCommit';
import OpenAIModel from '@/infrastructure/ai/OpenAIModel';
import { CommitHistory } from '@commit-generator/commit-history';
import { git } from '@commit-generator/git';

export default function createValidateCommit(
  commitGeneratorConfig: { key: string },
  historyPath: string,
  excludeFiles: string[],
) {
  const openAIModel = new OpenAIModel(commitGeneratorConfig.key);
  const commitValidator = new CommitValidator(openAIModel);

  return new ValidateCommit({
    commitValidator,
    commitHistory: new CommitHistory(historyPath),
    excludeFiles,
    git,
  });
}
