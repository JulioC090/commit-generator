import { execSync } from 'node:child_process';

interface DiffOptions {
  staged?: boolean;
  excludeFiles?: Array<string>;
}

export default class Git {
  public isRepository(): boolean {
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

  private buildDiffArgs(options: DiffOptions) {
    const diffArgs: Array<string> = [];

    if (options.staged) {
      diffArgs.push('--cached --staged');
    }

    if (options.excludeFiles && options.excludeFiles.length > 0) {
      diffArgs.push('-- .');
      diffArgs.push(...options.excludeFiles.map((file) => `:(exclude)${file}`));
    }

    return diffArgs.join(' ').trim();
  }

  public diff(options: DiffOptions = { staged: false }): string {
    try {
      return execSync(`git diff ${this.buildDiffArgs(options)}`, {
        encoding: 'utf-8',
      }).trim();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      return '';
    }
  }

  public commit(commitMessage: string): void {
    execSync('git commit -F -', { input: commitMessage });
  }
}
