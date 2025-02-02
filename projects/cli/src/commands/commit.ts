import { historyPath } from '@/constants';
import { createCommitGenerated } from '@commit-generator/core';

export default async function commit() {
  await createCommitGenerated(historyPath).execute();
}
