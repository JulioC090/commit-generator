export default interface ICommitHistory {
  add(commitMessage: string): Promise<void>;
  get(numberOfLines: number): Promise<Array<string>>;
}
