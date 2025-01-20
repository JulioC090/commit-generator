import UnsetKeys from '@/actions/UnsetKeys';
import IConfig from '@/config/types/IConfig';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const mockConfigManager = {
  unset: vi.fn(),
} as unknown as IConfig;

describe('UnsetKeys', () => {
  let sut: UnsetKeys;

  beforeEach(() => {
    sut = new UnsetKeys({ configManager: mockConfigManager });
    vi.resetAllMocks();
  });

  it('should unset for each key', async () => {
    const keys = ['key1', 'key2'];

    await sut.execute(keys);

    expect(mockConfigManager.unset).toHaveBeenCalledTimes(2);
    expect(mockConfigManager.unset).toHaveBeenCalledWith('key1', 'local');
    expect(mockConfigManager.unset).toHaveBeenCalledWith('key2', 'local');
  });

  it('should not unset if keys are empty', async () => {
    const keys: string[] = [];

    await sut.execute(keys);

    expect(mockConfigManager.unset).not.toHaveBeenCalled();
  });
});
