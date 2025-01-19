import IConfig from '@/config/types/IConfig';

interface SaveKeyProps {
  configManager: IConfig;
}

export default class SaveKey {
  private configManager: IConfig;

  constructor({ configManager }: SaveKeyProps) {
    this.configManager = configManager;
  }

  async execute(key: string, value: string) {
    await this.configManager.set(key, value, 'local');
  }
}
