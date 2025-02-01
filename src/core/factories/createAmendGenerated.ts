import AmendGenerated from '@/core/actions/AmendGenerated';
import GetHistory from '@/core/actions/GetHistory';
import git from '@/git';

export default function createAmendGenerated(historyPath: string) {
  return new AmendGenerated({
    getHistory: new GetHistory({ historyPath }),
    git,
  });
}
