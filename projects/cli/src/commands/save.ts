import configManager, { IConfigType } from '@/config';
import { formatConfigValue } from '@commit-generator/config';

export default async function save(
  pairs: Array<{ key: string; value: string }>,
) {
  for (const { key, value } of pairs) {
    const formattedValue = formatConfigValue(value);
    await configManager.set(key as keyof IConfigType, formattedValue, 'local');
  }
}
