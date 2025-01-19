import ICommitGenerator from '@/commit-generator/ICommitGenerator';
import IUserInteractor from '@/user-interactor/IUserInteractor';
import { exitWithError } from '@/utils/errorHandler';
import Git from '@/utils/Git';

interface GenerateCommitProps {
  userInteractor: IUserInteractor;
  commitGenerator: ICommitGenerator;
  git: Git;
  excludeFiles?: string[];
}

interface ExecuteOptions {
  force?: boolean;
  type?: string;
}

export default class GenerateCommit {
  private userInteractor: IUserInteractor;
  private commitGenerator: ICommitGenerator;
  private git: Git;
  private excludeFiles?: string[];

  constructor({
    userInteractor,
    commitGenerator,
    git,
    excludeFiles,
  }: GenerateCommitProps) {
    this.userInteractor = userInteractor;
    this.commitGenerator = commitGenerator;
    this.git = git;
    this.excludeFiles = excludeFiles;
  }

  public async execute(options: ExecuteOptions) {
    if (!this.git.isRepository()) {
      exitWithError(
        'Error: The current directory is not a valid Git repository.',
      );
    }

    const diff = this.git.diff({
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

    this.git.commit(finalCommit);
  }
}
