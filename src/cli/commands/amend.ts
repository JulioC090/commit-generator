import { historyPath } from '@/cli/constants';
import createAmendGenerated from '@/core/factories/createAmendGenerated';

export default async function amend() {
  await createAmendGenerated(historyPath).execute();
}
