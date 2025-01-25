import configManager from '@/config';
import UnsetKeys from '@/core/actions/UnsetKeys';

export default async function remove(keys: Array<string>) {
  const unsetKey = new UnsetKeys({ configManager });
  await unsetKey.execute(keys);
}
