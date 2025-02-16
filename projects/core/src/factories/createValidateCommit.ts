import ValidateCommit from '@/application/ValidateCommit';
import CommitValidator from '@/services/CommitValidator';
import { IAIModelParams } from '@/types/IAIModel';
import { createAIModel } from '@commit-generator/ai-models';
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
