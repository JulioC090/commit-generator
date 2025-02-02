import CommitGenerated from '@/actions/CommitGenerated';
import GetHistory from '@/actions/GetHistory';
import { git } from '@commit-generator/git';

export default function createCommitGenerated(historyPath: string) {
  return new CommitGenerated({
    getHistory: new GetHistory({ historyPath }),
    git,
  });
}
