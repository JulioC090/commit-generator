import ConfigSourceManager from '@/ConfigSourceManager';
import ConfigValidator from '@/ConfigValidator';
import { ConfigValue } from '@/types/ConfigValue';
import IConfig from '@/types/IConfig';
interface ConfigManagerProps<IConfigType> {
  configSourceManager: ConfigSourceManager;
  configValidator: ConfigValidator<IConfigType>;
}

export default class ConfigManager<IConfigType>
  implements IConfig<IConfigType>
{
  private allConfigsLoaded = new Map<string, ConfigValue>();
  private config: ConfigValue = {};
  private isLoaded = false;

  private configSourceManager: ConfigSourceManager;
  private configValidator: ConfigValidator<IConfigType>;

  constructor({
    configSourceManager,
    configValidator,
  }: ConfigManagerProps<IConfigType>) {
    this.configSourceManager = configSourceManager;
    this.configValidator = configValidator;
  }

  async loadConfig(): Promise<ConfigValue> {
    if (this.isLoaded) return this.config;

    const sources = this.configSourceManager.getSources();

    for (const source of sources) {
      const config = await this.configSourceManager.load(source.name);
      this.config = { ...this.config, ...config };
    }

    this.isLoaded = true;

    const validation = this.configValidator.validate(this.config);

    if (!validation.valid) {
      console.error('Config loaded with errors:');
      validation.errors!.forEach((error) => console.error(error.message));
    }

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

  async set<K extends keyof IConfigType>(
    key: K,
    value: unknown,
    sourceName: string,
  ) {
    const validation = this.configValidator.validateKey(key, value);

    if (!validation.valid) {
      console.error('Config loaded with errors:');
      validation.errors!.forEach((error) => console.error(error.message));
      return;
    }

    const fileConfig = await this.configSourceManager.load(sourceName);

    fileConfig[key as string] = value;

    await this.configSourceManager.write(sourceName, fileConfig);
  }

  async unset(key: string, sourceName: string) {
    const fileConfig = await this.configSourceManager.load(sourceName);

    delete fileConfig[key];

    await this.configSourceManager.write(sourceName, fileConfig);
  }
}
