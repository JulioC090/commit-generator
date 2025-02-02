import { historyPath } from '@/constants';
import editLine from '@/utils/editLine';
import { createEditLastGenerated } from '@commit-generator/core';

export default async function edit() {
  await createEditLastGenerated(editLine, historyPath).execute();
}
