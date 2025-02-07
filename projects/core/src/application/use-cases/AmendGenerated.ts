import ICommitHistory from '@/application/interfaces/ICommitHistory';
import { IGit } from '@commit-generator/git';

interface AmendGeneratedProps {
  commitHistory: ICommitHistory;
  git: IGit;
}

export default class AmendGenerated {
  private commitHistory: ICommitHistory;
  private git: IGit;

  constructor({ commitHistory, git }: AmendGeneratedProps) {
    this.commitHistory = commitHistory;
    this.git = git;
  }

  async execute(): Promise<void> {
    const history = await this.commitHistory.get(1);

    if (history.length === 0) {
      throw new Error('No commits found in history');
    }

    const lastCommitMessage = history[0];

    this.git.amend(lastCommitMessage);
  }
}
