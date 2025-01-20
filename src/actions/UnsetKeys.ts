import IConfig from '@/config/types/IConfig';

interface UnsetKeyProps {
  configManager: IConfig;
}

export default class UnsetKeys {
  private configManager: IConfig;

  constructor({ configManager }: UnsetKeyProps) {
    this.configManager = configManager;
  }

  async execute(keys: Array<string>) {
    for (const key of keys) {
      await this.configManager.unset(key, 'local');
    }
  }
}
