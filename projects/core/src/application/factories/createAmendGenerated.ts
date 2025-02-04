import AmendGenerated from '@/application/use-cases/AmendGenerated';
import GetHistory from '@/application/use-cases/GetHistory';
import { git } from '@commit-generator/git';

export default function createAmendGenerated(historyPath: string) {
  return new AmendGenerated({
    getHistory: new GetHistory({ historyPath }),
    git,
  });
}
