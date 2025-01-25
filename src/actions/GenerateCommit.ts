import AddHistory from '@/actions/AddHistory';
import ICommitGenerator from '@/commit-generator/ICommitGenerator';
import IUserInteractor from '@/user-interactor/IUserInteractor';
import { exitWithError } from '@/utils/errorHandler';
import Git from '@/utils/Git';

interface GenerateCommitProps {
  userInteractor: IUserInteractor;
  commitGenerator: ICommitGenerator;
  git: Git;
  excludeFiles?: string[];
  addHistory: AddHistory;
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
  private addHistory: AddHistory;

  constructor({
    userInteractor,
    commitGenerator,
    git,
    excludeFiles,
    addHistory,
  }: GenerateCommitProps) {
    this.userInteractor = userInteractor;
    this.commitGenerator = commitGenerator;
    this.git = git;
    this.excludeFiles = excludeFiles;
    this.addHistory = addHistory;
  }

  public async execute(options: ExecuteOptions): Promise<string> {
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

    this.addHistory.execute(finalCommit);

    return finalCommit;
  }
}
