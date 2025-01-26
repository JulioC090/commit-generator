import { exitWithError } from '@/cli/utils/errorHandler';
import AddHistory from '@/core/actions/AddHistory';
import ICommitGenerator from '@/core/commit-generator/ICommitGenerator';
import IUserInteractor from '@/core/user-interactor/IUserInteractor';
import IGit from '@/git/types/IGit';

interface GenerateCommitProps {
  userInteractor: IUserInteractor;
  commitGenerator: ICommitGenerator;
  git: IGit;
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
  private git: IGit;
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
