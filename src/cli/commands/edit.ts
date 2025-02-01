import { historyPath } from '@/cli/constants';
import editLine from '@/cli/utils/editLine';
import createEditLastGenerated from '@/core/factories/createEditLastGenerated';

export default async function edit() {
  await createEditLastGenerated(editLine, historyPath).execute();
}
