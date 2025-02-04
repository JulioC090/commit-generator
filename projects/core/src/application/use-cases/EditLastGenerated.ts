import AddHistory from '@/application/use-cases/AddHistory';
import GetHistory from '@/application/use-cases/GetHistory';
import { IGit } from '@commit-generator/git';

interface EditLastGeneratedProps {
  getHistory: GetHistory;
  addHistory: AddHistory;
  git: IGit;
  editMessage: (message: string) => Promise<string>;
}

export default class EditLastGenerated {
  private getHistory: GetHistory;
  private addHistory: AddHistory;
  private git: IGit;
  private editMessage: (message: string) => Promise<string>;

  constructor({
    getHistory,
    addHistory,
    git,
    editMessage,
  }: EditLastGeneratedProps) {
    this.getHistory = getHistory;
    this.addHistory = addHistory;
    this.git = git;
    this.editMessage = editMessage;
  }

  async execute(): Promise<void> {
    const history = await this.getHistory.execute(1);

    if (history.length === 0) {
      throw new Error('No commits found in history');
    }

    const lastCommitMessage = history[0];
    const newMessage = await this.editMessage(lastCommitMessage);

    if (!newMessage || newMessage.trim() === '') {
      throw new Error('Commit message cannot be empty');
    }

    await this.addHistory.execute(newMessage);
  }
}
