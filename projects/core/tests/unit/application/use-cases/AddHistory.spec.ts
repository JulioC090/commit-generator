import AddHistory from '@/application/use-cases/AddHistory';
import fsSync from 'node:fs';
import fs from 'node:fs/promises';
import path from 'node:path';
import { afterAll, beforeEach, describe, expect, it } from 'vitest';

const historyPath = path.join(__dirname, 'history');

async function clearHistory() {
  if (!fsSync.existsSync(historyPath)) return;
  await fs.unlink(historyPath);
}

describe('AddHistory', () => {
  beforeEach(async () => {
    await clearHistory();
  });

  afterAll(async () => {
    fs.rm(historyPath);
  });

  it('should append a line to the history file', async () => {
    const addHistory = new AddHistory({ historyPath });
    const commitMessage = 'Test commit';

    await addHistory.execute(commitMessage);

    const content = await fs.readFile(historyPath, 'utf8');
    expect(content).toContain(`${commitMessage}\n`);
  });

  it('should append multiple lines to the history file', async () => {
    const addHistory = new AddHistory({ historyPath });
    const commitMessages = ['First commit', 'Second commit'];

    for (const msg of commitMessages) {
      await addHistory.execute(msg);
    }

    const content = await fs.readFile(historyPath, 'utf8');
    const lines = content.trim().split('\n');
    expect(lines).toEqual(commitMessages);
  });
});
