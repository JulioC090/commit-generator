import { historyPath } from '@/cli/constants';
import CommitGenerated from '@/core/actions/CommitGenerated';
import GetHistory from '@/core/actions/GetHistory';
import Git from '@/core/utils/Git';

export default async function commit() {
  const getHistory = new GetHistory({ historyPath });
  const git = new Git();
  const commitGenerated = new CommitGenerated({ getHistory, git });
  await commitGenerated.execute();
}
