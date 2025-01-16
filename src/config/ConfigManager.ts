import ConfigSourceManager from '@/config/ConfigSourceManager';
import formatConfigValue from '@/config/formatConfigValue';
import { ConfigValue } from '@/config/types/ConfigValue';
interface ConfigManagerProps {
  configSourceManager: ConfigSourceManager;
}

export default class ConfigManager {
  private allConfigsLoaded = new Map<string, ConfigValue>();
  private config: ConfigValue = {};
  private isLoaded = false;

  private configSourceManager: ConfigSourceManager;

  constructor({ configSourceManager }: ConfigManagerProps) {
    this.configSourceManager = configSourceManager;
  }

  async loadConfig(): Promise<ConfigValue> {
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
      return this.config[key] ?? undefined;
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
        return cachedConfig[key];
      }
    }

    return undefined;
  }

  async set(key: string, value: string, sourceName: string) {
    const fileConfig = await this.configSourceManager.load(sourceName);

    fileConfig[key] = formatConfigValue(value);

    await this.configSourceManager.write(sourceName, fileConfig);
  }

  async unset(key: string, sourceName: string) {
    const fileConfig = await this.configSourceManager.load(sourceName);

    delete fileConfig[key];

    await this.configSourceManager.write(sourceName, fileConfig);
  }
}
