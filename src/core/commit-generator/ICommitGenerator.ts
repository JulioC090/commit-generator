import CommitInfo from '@/core/commit-generator/CommitInfo';

export default interface ICommitGenerator {
  generate(commitInfo: CommitInfo): Promise<string>;
}
