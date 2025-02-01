import CommitGenerated from '@/core/actions/CommitGenerated';
import GetHistory from '@/core/actions/GetHistory';
import git from '@/git';

export default function createCommitGenerated(historyPath: string) {
  return new CommitGenerated({
    getHistory: new GetHistory({ historyPath }),
    git,
  });
}
