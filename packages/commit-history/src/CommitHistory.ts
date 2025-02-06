import fs from 'node:fs/promises';

export default class CommitHistory {
  constructor(private historyPath: string) {}

  public async add(generatedCommit: string): Promise<void> {
    await fs.appendFile(this.historyPath, `${generatedCommit}\n`, 'utf8');
  }

  public async get(numberOfLines: number): Promise<Array<string>> {
    try {
      const historyContent = await fs.readFile(this.historyPath, 'utf8');

      if (numberOfLines < 0) {
        numberOfLines = 1;
      }

      const reversedHistory = historyContent
        .split('\n')
        .filter((line) => line.trim() !== '')
        .reverse()
        .slice(0, numberOfLines);

      return reversedHistory;
    } catch {
      return [];
    }
  }
}
