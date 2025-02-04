import AddHistory from '@/application/use-cases/AddHistory';
import EditLastGenerated from '@/application/use-cases/EditLastGenerated';
import GetHistory from '@/application/use-cases/GetHistory';
import { git } from '@commit-generator/git';

export default function createEditLastGenerated(
  editMessage: (message: string) => Promise<string>,
  historyPath: string,
) {
  return new EditLastGenerated({
    addHistory: new AddHistory({ historyPath }),
    getHistory: new GetHistory({ historyPath }),
    editMessage,
    git,
  });
}
