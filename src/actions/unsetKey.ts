import configManager from '@/config';

export default async function (key: string) {
  await configManager.unset(key, 'local');
}
