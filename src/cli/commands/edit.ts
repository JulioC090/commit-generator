import { historyPath } from '@/cli/constants';
import editLine from '@/cli/utils/editLine';
import AddHistory from '@/core/actions/AddHistory';
import EditLastGenerated from '@/core/actions/EditLastGenerated';
import GetHistory from '@/core/actions/GetHistory';
import git from '@/git';

export default async function edit() {
  const editLastGenerated = new EditLastGenerated({
    addHistory: new AddHistory({ historyPath }),
    getHistory: new GetHistory({ historyPath }),
    editMessage: editLine,
    git,
  });

  await editLastGenerated.execute();
}
