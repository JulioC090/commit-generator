import configManager from '@/config';

export default async function saveKey(key: string, value: string) {
  await configManager.set(key, value, 'local');
}
