import editLine from '@/utils/editLine';
import readline from 'node:readline/promises';
import { describe, expect, it, vi } from 'vitest';

vi.mock('node:readline/promises', () => {
  const readline = {
    createInterface: vi.fn().mockReturnValue({
      question: vi.fn().mockImplementation(async () => {
        return 'user confirmed message';
      }),
      write: vi.fn(),
      close: vi.fn(),
    }),
  };
  return { default: readline };
});

describe('editLine', () => {
  it('should confirm the commit message from user input', async () => {
    const commitMessage = 'Initial commit';

    const finalCommit = await editLine(commitMessage);

    expect(finalCommit).toBe('user confirmed message');

    const rl = readline.createInterface({ input: process.stdin });
    expect(rl.write).toHaveBeenCalledWith(commitMessage);
    expect(rl.close).toHaveBeenCalled();
  });
});
