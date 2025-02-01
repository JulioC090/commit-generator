import AddHistory from '@/core/actions/AddHistory';
import GenerateCommit from '@/core/actions/GenerateCommit';
import OpenAICommitGenerator from '@/core/commit-generator/OpenAICommitGenerator';
import git from '@/git';

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
