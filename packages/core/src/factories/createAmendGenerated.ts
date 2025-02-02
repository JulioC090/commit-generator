import AmendGenerated from '@/actions/AmendGenerated';
import GetHistory from '@/actions/GetHistory';
import { git } from '@commit-generator/git';

export default function createAmendGenerated(historyPath: string) {
  return new AmendGenerated({
    getHistory: new GetHistory({ historyPath }),
    git,
  });
}
