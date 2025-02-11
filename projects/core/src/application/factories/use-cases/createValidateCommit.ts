import createAIModel from '@/application/factories/ai/createAIModel';
import { IAIModelParams } from '@/application/interfaces/IAIModel';
import CommitValidator from '@/application/services/CommitValidator';
import ValidateCommit from '@/application/use-cases/ValidateCommit';
import { CommitHistory } from '@commit-generator/commit-history';
import { git } from '@commit-generator/git';

export default function createValidateCommit(
  config: {
    provider: string;
    params: IAIModelParams;
  },
  historyPath: string,
  excludeFiles: string[],
) {
  const aiModel = createAIModel(config.provider, config.params);
  const commitValidator = new CommitValidator(aiModel);

  return new ValidateCommit({
    commitValidator,
    commitHistory: new CommitHistory(historyPath),
    excludeFiles,
    git,
  });
}
