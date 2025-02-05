import CommitGenerator from '@/application/services/CommitGenerator';
import AddHistory from '@/application/use-cases/AddHistory';
import GenerateCommit from '@/application/use-cases/GenerateCommit';
import OpenAIModel from '@/infrastructure/ai/OpenAIModel';
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
    addHistory: new AddHistory({ historyPath }),
    excludeFiles,
    git,
  });
}
