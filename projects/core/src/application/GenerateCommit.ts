import ICommitGenerator from '@/types/ICommitGenerator';
import ICommitHistory from '@/types/ICommitHistory';
import ICommitInfo from '@/types/ICommitInfo';
import { IGit } from '@commit-generator/git';

interface GenerateCommitProps {
  commitGenerator: ICommitGenerator;
  commitHistory: ICommitHistory;
  git: IGit;
  excludeFiles?: string[];
}

type ExecuteOptions = Omit<ICommitInfo, 'diff' | 'previousLogs'>;

export default class GenerateCommit {
  private commitGenerator: ICommitGenerator;
  private commitHistory: ICommitHistory;
  private git: IGit;
  private excludeFiles?: string[];

  constructor({
    commitGenerator,
    commitHistory,
    git,
    excludeFiles,
  }: GenerateCommitProps) {
    this.commitGenerator = commitGenerator;
    this.git = git;
    this.excludeFiles = excludeFiles;
    this.commitHistory = commitHistory;
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
      previousLogs,
      ...options,
    });

    this.commitHistory.add(commitMessage);

    return commitMessage;
  }
}
