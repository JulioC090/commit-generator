import CommitGenerated from '@/application/use-cases/CommitGenerated';
import GetHistory from '@/application/use-cases/GetHistory';
import { git } from '@commit-generator/git';

export default function createCommitGenerated(historyPath: string) {
  return new CommitGenerated({
    getHistory: new GetHistory({ historyPath }),
    git,
  });
}
