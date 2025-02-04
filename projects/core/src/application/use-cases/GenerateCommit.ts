import ICommitGenerator from '@/application/interfaces/ICommitGenerator';
import AddHistory from '@/application/use-cases/AddHistory';
import { IGit } from '@commit-generator/git';

interface GenerateCommitProps {
  commitGenerator: ICommitGenerator;
  git: IGit;
  excludeFiles?: string[];
  addHistory: AddHistory;
}

interface ExecuteOptions {
  type?: string;
}

export default class GenerateCommit {
  private commitGenerator: ICommitGenerator;
  private git: IGit;
  private excludeFiles?: string[];
  private addHistory: AddHistory;

  constructor({
    commitGenerator,
    git,
    excludeFiles,
    addHistory,
  }: GenerateCommitProps) {
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
      throw new Error('Error: No staged files found.');
    }

    const previousLogs = this.git.log(5);

    const commitMessage = await this.commitGenerator.generate({
      diff,
      type: options.type,
      previousLogs,
    });

    this.addHistory.execute(commitMessage);

    return commitMessage;
  }
}
