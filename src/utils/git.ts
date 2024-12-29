import { execSync } from 'node:child_process';

export function isRepository(): boolean {
  try {
    const output = execSync('git rev-parse --is-inside-work-tree --quiet', {
      encoding: 'utf-8',
    });
    return output.trim() === 'true';
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (e) {
    return false;
  }
}

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
