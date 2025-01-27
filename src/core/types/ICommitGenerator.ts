import ICommitInfo from '@/core/types/ICommitInfo';

export default interface ICommitGenerator {
  generate(commitInfo: ICommitInfo): Promise<string>;
}
