import AddHistory from '@/core/actions/AddHistory';
import EditLastGenerated from '@/core/actions/EditLastGenerated';
import GetHistory from '@/core/actions/GetHistory';
import git from '@/git';

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
