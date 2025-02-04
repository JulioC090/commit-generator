import ICommitInfo from '@/types/ICommitInfo';

export default interface ICommitGenerator {
  generate(commitInfo: ICommitInfo): Promise<string>;
}
