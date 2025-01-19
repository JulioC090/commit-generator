import IConfig from '@/config/types/IConfig';

interface UnsetKeyProps {
  configManager: IConfig;
}

export default class UnsetKey {
  private configManager: IConfig;

  constructor({ configManager }: UnsetKeyProps) {
    this.configManager = configManager;
  }

  async execute(key: string) {
    await this.configManager.unset(key, 'local');
  }
}
