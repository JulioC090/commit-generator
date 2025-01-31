import { historyPath } from '@/cli/constants';
import AmendGenerated from '@/core/actions/AmendGenerated';
import GetHistory from '@/core/actions/GetHistory';
import git from '@/git';

export default async function amend() {
  const getHistory = new GetHistory({ historyPath });
  const amendGenerated = new AmendGenerated({ getHistory, git });
  await amendGenerated.execute();
}
