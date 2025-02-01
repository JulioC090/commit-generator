import { createKeyValueArray } from '@/cli/utils/createKeyValueArray';
import configManager from '@/config';

export default async function save(keyValues: Array<string>) {
  const pairs = createKeyValueArray(keyValues);

  for (const { key, value } of pairs) {
    await configManager.set(key, value, 'local');
  }
}
