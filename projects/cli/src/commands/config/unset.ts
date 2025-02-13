import configManager from '@/config';

export default async function unset(keys: Array<string>) {
  for (const key of keys) {
    await configManager.unset(key, 'local');
  }
}
