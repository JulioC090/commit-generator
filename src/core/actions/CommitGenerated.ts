import GetHistory from '@/core/actions/GetHistory';
import Git from '@/core/utils/Git';

interface CommitGeneratedProps {
  getHistory: GetHistory;
  git: Git;
}

export default class CommitGenerated {
  private getHistory: GetHistory;
  private git: Git;

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
