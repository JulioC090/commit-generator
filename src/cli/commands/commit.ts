import { historyPath } from '@/cli/constants';
import CommitGenerated from '@/core/actions/CommitGenerated';
import GetHistory from '@/core/actions/GetHistory';
import git from '@/git';

export default async function commit() {
  const getHistory = new GetHistory({ historyPath });
  const commitGenerated = new CommitGenerated({ getHistory, git });
  await commitGenerated.execute();
}
