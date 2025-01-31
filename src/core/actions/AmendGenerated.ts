import GetHistory from '@/core/actions/GetHistory';
import IGit from '@/git/types/IGit';

interface AmendGeneratedProps {
  getHistory: GetHistory;
  git: IGit;
}

export default class AmendGenerated {
  private getHistory: GetHistory;
  private git: IGit;

  constructor({ getHistory, git }: AmendGeneratedProps) {
    this.getHistory = getHistory;
    this.git = git;
  }

  async execute(): Promise<void> {
    const history = await this.getHistory.execute(1);

    if (history.length === 0) {
      throw new Error('No commits found in history');
    }

    const lastCommitMessage = history[0];

    this.git.amend(lastCommitMessage);
  }
}
