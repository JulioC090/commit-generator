import { emptyTree } from '@/constants';
import IDiffOptions from '@/types/IDiffOptions';
import { execSync } from 'node:child_process';

export default function buildDiffArgs(options: IDiffOptions) {
  const diffArgs: Array<string> = [];

  if (options.staged) {
    diffArgs.push('--cached --staged');
  }

  if (options.lastCommit) {
    if (options.staged) {
      throw new Error('Cannot use both lastCommit and staged together');
    }

    const commitList = execSync('git rev-list --max-count=2 HEAD', {
      encoding: 'utf8',
    })
      .split('\n')
      .filter(Boolean);

    if (commitList.length === 0) {
      throw new Error('No commits were found');
    } else if (commitList.length === 1) {
      diffArgs.push(`${emptyTree} ${commitList[0]}`);
    } else {
      diffArgs.push(`${commitList[1]} ${commitList[0]}`);
    }
  }

  if (options.excludeFiles && options.excludeFiles.length > 0) {
    diffArgs.push('-- .');
    diffArgs.push(...options.excludeFiles.map((file) => `:(exclude)${file}`));
  }

  return diffArgs.join(' ').trim();
}
