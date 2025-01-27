import IDiffOptions from '@/git/types/IDiffOptions';

export default function buildDiffArgs(options: IDiffOptions) {
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
