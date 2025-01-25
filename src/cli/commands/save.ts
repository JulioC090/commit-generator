import { createKeyValueArray } from '@/cli/utils/createKeyValueArray';
import configManager from '@/config';
import SaveKey from '@/core/actions/SaveKeys';

export default async function save(keyValues: Array<string>) {
  const saveKey = new SaveKey({ configManager });
  const keyValuePairs = createKeyValueArray(keyValues);
  await saveKey.execute(keyValuePairs);
}
