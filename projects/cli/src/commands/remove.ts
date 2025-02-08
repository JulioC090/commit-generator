import configManager from '@/config';

export default async function remove(keys: Array<string>) {
  for (const key of keys) {
    await configManager.unset(key, 'local');
  }
}
