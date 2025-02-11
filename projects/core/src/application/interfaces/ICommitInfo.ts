export default interface ICommitInfo {
  diff: string;
  type?: string;
  context?: string;
  previousLogs?: string;
}
