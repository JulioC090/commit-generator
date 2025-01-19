export default interface IUserInteractor {
  confirmCommitMessage(commitMessage: string): Promise<string>;
}
