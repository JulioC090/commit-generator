import AddHistory from '@/application/use-cases/AddHistory';
import ValidateCommit from '@/application/use-cases/ValidateCommit';
import OpenAICommitValidator from '@/infrastructure/ai/OpenAICommitValidator';
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
