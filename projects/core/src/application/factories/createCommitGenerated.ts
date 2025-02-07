import CommitGenerated from '@/application/use-cases/CommitGenerated';
import { CommitHistory } from '@commit-generator/commit-history';
import { git } from '@commit-generator/git';

export default function createCommitGenerated(historyPath: string) {
  return new CommitGenerated({
    commitHistory: new CommitHistory(historyPath),
    git,
  });
}
