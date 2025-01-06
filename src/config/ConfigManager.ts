import ConfigSourceManager from '@/config/ConfigSourceManager';
import formatConfigValue from '@/config/formatConfigValue';
import IConfig from '@/config/IConfig';

interface ConfigManagerProps {
  configSourceManager: ConfigSourceManager;
}

export default class ConfigManager {
  private allConfigsLoaded = new Map<string, Partial<IConfig>>();
  private config: Partial<IConfig> = {};
  private isLoaded = false;

  private configSourceManager: ConfigSourceManager;

  constructor({ configSourceManager }: ConfigManagerProps) {
    this.configSourceManager = configSourceManager;
  }

  async loadConfig(): Promise<Partial<IConfig>> {
    if (this.isLoaded) return this.config;

    const sources = this.configSourceManager.getSources();

    for (const source of sources) {
      const config = await this.configSourceManager.load(source.name);
      this.config = { ...this.config, ...config };
    }

    this.isLoaded = true;

    return this.config;
  }

  async get(key: string) {
    if (this.isLoaded) {
      return this.config[key as keyof IConfig] ?? undefined;
    }

    const sources = this.configSourceManager.getSources();

    for (let i = sources.length - 1; i >= 0; i--) {
      const source = sources[i];

      if (!this.allConfigsLoaded.has(source.name)) {
        const config = await this.configSourceManager.load(source.name);
        this.allConfigsLoaded.set(source.name, config);
      }

      const cachedConfig = this.allConfigsLoaded.get(source.name)!;
      if (key in cachedConfig) {
        return cachedConfig[key as keyof IConfig];
      }
    }

    return undefined;
  }

  async set(key: keyof IConfig, value: string, sourceName: string) {
    const fileConfig: { [key: string]: unknown } =
      await this.configSourceManager.load(sourceName);

    fileConfig[key] = formatConfigValue(value);

    await this.configSourceManager.write(sourceName, fileConfig);
  }

  async unset(key: string, sourceName: string) {
    const fileConfig: { [key: string]: unknown } =
      await this.configSourceManager.load(sourceName);

    delete fileConfig[key];

    await this.configSourceManager.write(sourceName, fileConfig);
  }
}
