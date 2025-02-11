import CommitGenerator from '@/application/services/CommitGenerator';
import GenerateCommit from '@/application/use-cases/GenerateCommit';
import OpenAIModel from '@/infrastructure/ai/OpenAIModel';
import { CommitHistory } from '@commit-generator/commit-history';
import { git } from '@commit-generator/git';

export default function createGenerateCommit(
  commitGeneratorConfig: { key: string },
  historyPath: string,
  excludeFiles: string[],
) {
  const openAIModel = new OpenAIModel(commitGeneratorConfig.key);
  const commitGenerator = new CommitGenerator(openAIModel);

  return new GenerateCommit({
    commitGenerator,
    commitHistory: new CommitHistory(historyPath),
    excludeFiles,
    git,
  });
}
