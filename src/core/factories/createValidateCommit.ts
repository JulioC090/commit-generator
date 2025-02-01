import AddHistory from '@/core/actions/AddHistory';
import ValidateCommit from '@/core/actions/ValidateCommit';
import OpenAICommitValidator from '@/core/commit-validator/OpenAICommitValidator';
import git from '@/git';

export default function createValidateCommit(
  commitGeneratorConfig: { key: string },
  historyPath: string,
  excludeFiles: string[],
) {
  return new ValidateCommit({
    addHistory: new AddHistory({ historyPath }),
    commitValidator: new OpenAICommitValidator(commitGeneratorConfig.key),
    excludeFiles,
    git,
  });
}
