import AmendGenerated from '@/application/AmendGenerated';
import { CommitHistory } from '@commit-generator/commit-history';
import { git } from '@commit-generator/git';

export default function createAmendGenerated(historyPath: string) {
  return new AmendGenerated({
    commitHistory: new CommitHistory(historyPath),
    git,
  });
}
