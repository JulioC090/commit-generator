import GetHistory from '@/core/actions/GetHistory';
import IGit from '@/git/types/IGit';

interface CommitGeneratedProps {
  getHistory: GetHistory;
  git: IGit;
}

export default class CommitGenerated {
  private getHistory: GetHistory;
  private git: IGit;

  constructor({ getHistory, git }: CommitGeneratedProps) {
    this.getHistory = getHistory;
    this.git = git;
  }

  async execute(): Promise<void> {
    const history = await this.getHistory.execute(1);

    if (history.length === 0) {
      throw new Error('No commits found in history');
    }

    const lastCommitMessage = history[0];

    this.git.commit(lastCommitMessage);
  }
}
