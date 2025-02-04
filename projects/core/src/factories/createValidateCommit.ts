import AddHistory from '@/actions/AddHistory';
import ValidateCommit from '@/actions/ValidateCommit';
import OpenAICommitValidator from '@/commit-validator/OpenAICommitValidator';
import { git } from '@commit-generator/git';

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
