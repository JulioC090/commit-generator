import IConfig from '@/config/types/IConfig';

interface SaveKeyProps {
  configManager: IConfig;
}

interface Pair {
  key: string;
  value: string;
}

export default class SaveKey {
  private configManager: IConfig;

  constructor({ configManager }: SaveKeyProps) {
    this.configManager = configManager;
  }

  async execute(pairs: Array<Pair>) {
    for (const { key, value } of pairs) {
      await this.configManager.set(key, value, 'local');
    }
  }
}
