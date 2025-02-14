import ICommitHistory from '@/application/interfaces/ICommitHistory';
import ICommitValidator, {
  IValidateResult,
} from '@/application/interfaces/ICommitValidator';
import { IGit } from '@commit-generator/git';

interface ValidateCommitProps {
  commitValidator: ICommitValidator;
  commitHistory: ICommitHistory;
  git: IGit;
  excludeFiles?: string[];
}

interface ExecuteOptions {
  commitMessage?: string;
}

export default class ValidateCommit {
  private commitValidator: ICommitValidator;
  private git: IGit;
  private excludeFiles?: string[];
  private commitHistory: ICommitHistory;
  constructor({
    commitValidator,
    commitHistory,
    git,
    excludeFiles,
  }: ValidateCommitProps) {
    this.commitValidator = commitValidator;
    this.git = git;
    this.excludeFiles = excludeFiles;
    this.commitHistory = commitHistory;
  }

  public async execute(options: ExecuteOptions): Promise<IValidateResult> {
    let diff;
    let commitMessage;

    if (options.commitMessage) {
      diff = this.git.diff({ staged: true, excludeFiles: this.excludeFiles });
      commitMessage = options.commitMessage;
    } else {
      diff = this.git.diff({
        excludeFiles: this.excludeFiles,
        lastCommit: true,
      });
      commitMessage = this.git.log(1);
    }

    if (!diff) {
      throw new Error('No staged files found.');
    }

    const validateResult = await this.commitValidator.validate(commitMessage, {
      diff,
    });

    this.commitHistory.add(validateResult.recommendedMessage);

    return validateResult;
  }
}
