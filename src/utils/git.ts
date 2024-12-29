import { execSync } from 'node:child_process';

export function getStagedDiff(): string {
  try {
    return execSync('git diff --cached --staged', {
      encoding: 'utf-8',
    }).trim();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (e) {
    return '';
  }
}
