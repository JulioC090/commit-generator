import UnsetKey from '@/actions/UnsetKey';
import IConfig from '@/config/types/IConfig';
import { describe, expect, it, vi } from 'vitest';

const mockConfigManager = {
  unset: vi.fn(),
};

describe('UnsetKey', () => {
  it('should unset a key in the config manager', async () => {
    const sut = new UnsetKey({
      configManager: mockConfigManager as unknown as IConfig,
    });

    await sut.execute('testKey');

    expect(mockConfigManager.unset).toHaveBeenCalledWith('testKey', 'local');
  });
});
