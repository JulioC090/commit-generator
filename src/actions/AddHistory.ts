import fs from 'node:fs/promises';

interface AddHistoryProps {
  historyPath: string;
}

export default class AddHistory {
  private historyPath: string;

  constructor({ historyPath }: AddHistoryProps) {
    this.historyPath = historyPath;
  }

  async execute(generatedCommit: string): Promise<void> {
    await fs.appendFile(this.historyPath, `${generatedCommit}\n`, 'utf8');
  }
}
