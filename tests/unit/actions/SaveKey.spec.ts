import SaveKey from '@/actions/SaveKey';
import IConfig from '@/config/types/IConfig';
import { describe, expect, it, vi } from 'vitest';

const mockConfigManager = {
  set: vi.fn(),
};

describe('SaveKey', () => {
  it('should save a key-value pair to the config manager', async () => {
    const sut = new SaveKey({
      configManager: mockConfigManager as unknown as IConfig,
    });

    await sut.execute('testKey', 'testValue');

    expect(mockConfigManager.set).toHaveBeenCalledWith(
      'testKey',
      'testValue',
      'local',
    );
  });
});
