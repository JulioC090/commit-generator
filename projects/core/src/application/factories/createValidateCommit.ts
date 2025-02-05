import CommitValidator from '@/application/services/CommitValidator';
import AddHistory from '@/application/use-cases/AddHistory';
import ValidateCommit from '@/application/use-cases/ValidateCommit';
import OpenAIModel from '@/infrastructure/ai/OpenAIModel';
import { git } from '@commit-generator/git';

export default function createValidateCommit(
  commitGeneratorConfig: { key: string },
  historyPath: string,
  excludeFiles: string[],
) {
  const openAIModel = new OpenAIModel(commitGeneratorConfig.key);
  const commitValidator = new CommitValidator(openAIModel);

  return new ValidateCommit({
    addHistory: new AddHistory({ historyPath }),
    commitValidator,
    excludeFiles,
    git,
  });
}
