import AddHistory from '@/actions/AddHistory';
import GenerateCommit from '@/actions/GenerateCommit';
import OpenAICommitGenerator from '@/commit-generator/OpenAICommitGenerator';
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
