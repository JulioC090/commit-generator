import fs from 'node:fs/promises';

interface GetHistoryProps {
  historyPath: string;
}

export default class GetHistory {
  private historyPath: string;

  constructor({ historyPath }: GetHistoryProps) {
    this.historyPath = historyPath;
  }

  async execute(numberOfLines: number): Promise<Array<string>> {
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
