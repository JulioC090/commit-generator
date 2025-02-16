import GenerateCommit from '@/application/GenerateCommit';
import CommitGenerator from '@/services/CommitGenerator';
import { IAIModelParams } from '@/types/IAIModel';
import { createAIModel } from '@commit-generator/ai-models';
import { CommitHistory } from '@commit-generator/commit-history';
import { git } from '@commit-generator/git';

export default function createGenerateCommit(
  config: {
    provider: string;
    params: IAIModelParams;
  },
  historyPath: string,
  excludeFiles: string[],
) {
  const aiModel = createAIModel(config.provider, config.params);
  const commitGenerator = new CommitGenerator(aiModel);

  return new GenerateCommit({
    commitGenerator,
    commitHistory: new CommitHistory(historyPath),
    excludeFiles,
    git,
  });
}
