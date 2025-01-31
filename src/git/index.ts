import { exitWithError } from '@/cli/utils/errorHandler';
import buildDiffArgs from '@/git/buildDiffArgs';
import IDiffOptions from '@/git/types/IDiffOptions';
import IGit from '@/git/types/IGit';
import { execSync } from 'node:child_process';

class Git implements IGit {
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

  public diff(options: IDiffOptions = { staged: false }): string {
    if (!this.isRepository()) {
      exitWithError(
        'Error: The current directory is not a valid Git repository.',
      );
    }

    try {
      return execSync(`git diff ${buildDiffArgs(options)}`, {
        encoding: 'utf-8',
      }).trim();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      console.log(e);
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

  public amend(commitMessage: string): void {
    if (!this.isRepository()) {
      exitWithError(
        'Error: The current directory is not a valid Git repository.',
      );
    }

    execSync('git commit --amend -F -', { input: commitMessage });
  }

  public log(amount: number): string {
    try {
      return execSync(`git log -${amount} --pretty=format:%s`, {
        encoding: 'utf-8',
      }).trim();
    } catch {
      return '';
    }
  }
}

export default new Git();
