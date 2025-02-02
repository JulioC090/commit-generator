import { historyPath } from '@/constants';
import { createAmendGenerated } from '@commit-generator/core';

export default async function amend() {
  await createAmendGenerated(historyPath).execute();
}
