import ICommitHistory from '@/types/ICommitHistory';

interface EditLastGeneratedProps {
  commitHistory: ICommitHistory;
  editMessage: (message: string) => Promise<string>;
}

export default class EditLastGenerated {
  private commitHistory: ICommitHistory;
  private editMessage: (message: string) => Promise<string>;

  constructor({ commitHistory, editMessage }: EditLastGeneratedProps) {
    this.commitHistory = commitHistory;
    this.editMessage = editMessage;
  }

  async execute(): Promise<void> {
    const history = await this.commitHistory.get(1);

    if (history.length === 0) {
      throw new Error('No commits found in history');
    }

    const lastCommitMessage = history[0];
    const newMessage = await this.editMessage(lastCommitMessage);

    if (!newMessage || newMessage.trim() === '') {
      throw new Error('Commit message cannot be empty');
    }

    await this.commitHistory.add(newMessage);
  }
}
