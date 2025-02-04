import AddHistory from '@/actions/AddHistory';
import ICommitValidator, { IValidateResult } from '@/types/ICommitValidator';
import { IGit } from '@commit-generator/git';

interface ValidateCommitProps {
  commitValidator: ICommitValidator;
  git: IGit;
  excludeFiles?: string[];
  addHistory: AddHistory;
}

interface ExecuteOptions {
  commitMessage?: string;
}

export default class ValidateCommit {
  private commitValidator: ICommitValidator;
  private git: IGit;
  private excludeFiles?: string[];
  private addHistory: AddHistory;

  constructor({
    commitValidator,
    git,
    excludeFiles,
    addHistory,
  }: ValidateCommitProps) {
    this.commitValidator = commitValidator;
    this.git = git;
    this.excludeFiles = excludeFiles;
    this.addHistory = addHistory;
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

    const validateResult = await this.commitValidator.validate(commitMessage, {
      diff,
    });

    this.addHistory.execute(validateResult.recommendedMessage);

    return validateResult;
  }
}
