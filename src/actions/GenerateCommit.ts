import ICommitGenerator from '@/commit-generator/ICommitGenerator';
import IUserInteractor from '@/user-interactor/IUserInteractor';
import { exitWithError } from '@/utils/errorHandler';
import { getDiff, isRepository, makeCommit } from '@/utils/git';

interface GenerateCommitProps {
  userInteractor: IUserInteractor;
  commitGenerator: ICommitGenerator;
  excludeFiles?: string[];
}

interface ExecuteOptions {
  force?: boolean;
  type?: string;
}

export default class GenerateCommit {
  private userInteractor: IUserInteractor;
  private commitGenerator: ICommitGenerator;
  private excludeFiles?: string[];

  constructor({
    userInteractor,
    commitGenerator,
    excludeFiles,
  }: GenerateCommitProps) {
    this.userInteractor = userInteractor;
    this.commitGenerator = commitGenerator;
    this.excludeFiles = excludeFiles;
  }

  public async execute(options: ExecuteOptions) {
    if (!isRepository()) {
      exitWithError(
        'Error: The current directory is not a valid Git repository.',
      );
    }

    const diff = getDiff({
      staged: true,
      excludeFiles: this.excludeFiles,
    });

    if (!diff) {
      exitWithError('Error: No staged files found.');
    }

    const commitMessage = await this.commitGenerator.generate({
      diff,
      type: options.type,
    });

    let finalCommit = commitMessage;

    if (!options.force) {
      finalCommit =
        await this.userInteractor.confirmCommitMessage(commitMessage);
    }

    makeCommit(finalCommit);
  }
}
