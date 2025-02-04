import AddHistory from '@/actions/AddHistory';
import EditLastGenerated from '@/actions/EditLastGenerated';
import GetHistory from '@/actions/GetHistory';
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
