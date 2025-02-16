import EditLastGenerated from '@/application/EditLastGenerated';
import { CommitHistory } from '@commit-generator/commit-history';

export default function createEditLastGenerated(
  editMessage: (message: string) => Promise<string>,
  historyPath: string,
) {
  return new EditLastGenerated({
    commitHistory: new CommitHistory(historyPath),
    editMessage,
  });
}
