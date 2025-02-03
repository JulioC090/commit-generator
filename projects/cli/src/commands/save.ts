import configManager from '@commit-generator/config';

export default async function save(
  pairs: Array<{ key: string; value: string }>,
) {
  for (const { key, value } of pairs) {
    await configManager.set(key, value, 'local');
  }
}
