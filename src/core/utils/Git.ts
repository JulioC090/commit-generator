import { exitWithError } from '@/cli/utils/errorHandler';
import { execSync } from 'node:child_process';

interface DiffOptions {
  staged?: boolean;
  excludeFiles?: Array<string>;
}

export default class Git {
  private _isRepository?: boolean;

  public isRepository(): boolean {
    if (this._isRepository) return this._isRepository;

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
    if (!this.isRepository()) {
      exitWithError(
        'Error: The current directory is not a valid Git repository.',
      );
    }

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
    if (!this.isRepository()) {
      exitWithError(
        'Error: The current directory is not a valid Git repository.',
      );
    }

    execSync('git commit -F -', { input: commitMessage });
  }
}
