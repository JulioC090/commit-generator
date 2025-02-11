import createAIModel from '@/application/factories/ai/createAIModel';
import { IAIModelParams } from '@/application/interfaces/IAIModel';
import CommitGenerator from '@/application/services/CommitGenerator';
import GenerateCommit from '@/application/use-cases/GenerateCommit';
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
