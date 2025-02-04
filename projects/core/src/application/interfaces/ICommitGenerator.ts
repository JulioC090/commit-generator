import ICommitInfo from '@/application/interfaces/ICommitInfo';

export default interface ICommitGenerator {
  generate(commitInfo: ICommitInfo): Promise<string>;
}
