import { historyPath } from '@/cli/constants';
import createCommitGenerated from '@/core/factories/createCommitGenerated';

export default async function commit() {
  await createCommitGenerated(historyPath).execute();
}
