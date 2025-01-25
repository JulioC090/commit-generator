import IConfig from '@/config/types/IConfig';
import SaveKey from '@/core/actions/SaveKeys';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const mockConfigManager = {
  set: vi.fn(),
} as unknown as IConfig;

describe('SaveKey', () => {
  let sut: SaveKey;

  beforeEach(() => {
    sut = new SaveKey({ configManager: mockConfigManager });

    vi.resetAllMocks();
  });

  it('should save each key-value pair', async () => {
    const pairs = [
      { key: 'key1', value: 'value1' },
      { key: 'key2', value: 'value2' },
    ];

    await sut.execute(pairs);

    expect(mockConfigManager.set).toHaveBeenCalledTimes(2);
    expect(mockConfigManager.set).toHaveBeenCalledWith(
      'key1',
      'value1',
      'local',
    );
    expect(mockConfigManager.set).toHaveBeenCalledWith(
      'key2',
      'value2',
      'local',
    );
  });

  it('should not save if pairs are empty', async () => {
    const pairs: Array<{ key: string; value: string }> = [];

    await sut.execute(pairs);

    expect(mockConfigManager.set).not.toHaveBeenCalled();
  });
});
