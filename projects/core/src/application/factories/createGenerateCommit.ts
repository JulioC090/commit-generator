import AddHistory from '@/application/use-cases/AddHistory';
import GenerateCommit from '@/application/use-cases/GenerateCommit';
import OpenAICommitGenerator from '@/infrastructure/ai/OpenAICommitGenerator';
import { git } from '@commit-generator/git';

export default function createGenerateCommit(
  commitGeneratorConfig: { key: string },
  historyPath: string,
  excludeFiles: string[],
) {
  return new GenerateCommit({
    commitGenerator: new OpenAICommitGenerator(commitGeneratorConfig.key),
    addHistory: new AddHistory({ historyPath }),
    excludeFiles,
    git,
  });
}
