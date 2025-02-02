import buildDiffArgs from '@/buildDiffArgs';
import IDiffOptions from '@/types/IDiffOptions';
import IGit from '@/types/IGit';
import { execSync } from 'node:child_process';

export default class Git implements IGit {
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
      throw new Error(
        'Error: The current directory is not a valid Git repository.',
      );
    }

    try {
      return execSync(`git diff ${buildDiffArgs(options)}`, {
        encoding: 'utf-8',
      }).trim();
    } catch (e) {
      console.log(e);
      return '';
    }
  }

  public commit(commitMessage: string): void {
    if (!this.isRepository()) {
      throw new Error(
        'Error: The current directory is not a valid Git repository.',
      );
    }

    execSync('git commit -F -', { input: commitMessage });
  }

  public amend(commitMessage: string): void {
    if (!this.isRepository()) {
      throw new Error(
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
