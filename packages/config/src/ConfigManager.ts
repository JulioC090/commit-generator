import ConfigSourceManager from '@/ConfigSourceManager';
import ConfigValidator from '@/ConfigValidator';
import IConfig from '@/types/IConfig';
import { IConfigValue } from '@/types/IConfigValue';
import _ from 'lodash';

interface ConfigManagerProps<IConfigType> {
  configSourceManager: ConfigSourceManager;
  configValidator: ConfigValidator<IConfigType>;
}

export default class ConfigManager<IConfigType>
  implements IConfig<IConfigType>
{
  private allConfigsLoaded = new Map<string, IConfigValue>();
  private config: IConfigValue = {};
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

  async loadConfig(): Promise<IConfigType> {
    if (this.isLoaded) return this.config as IConfigType;

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

    return this.config as IConfigType;
  }

  async get(key: string) {
    if (this.isLoaded) {
      return _.get(this.config, key) ?? undefined;
    }

    const sources = this.configSourceManager.getSources();

    for (let i = sources.length - 1; i >= 0; i--) {
      const source = sources[i];

      if (!this.allConfigsLoaded.has(source.name)) {
        const config = await this.configSourceManager.load(source.name);
        this.allConfigsLoaded.set(source.name, config);
      }

      const cachedConfig = this.allConfigsLoaded.get(source.name)!;
      const value = _.get(cachedConfig, key, undefined);

      if (value !== undefined) {
        return value;
      }
    }

    return undefined;
  }

  async set(key: string, value: unknown, sourceName: string) {
    const validation = this.configValidator.validateKey(key as string, value);

    if (!validation.valid) {
      console.error('Config loaded with errors:');
      validation.errors!.forEach((error) => console.error(error.message));
      return;
    }

    const fileConfig = await this.configSourceManager.load(sourceName);

    _.set(fileConfig, key, value);

    await this.configSourceManager.write(sourceName, fileConfig);
  }

  async unset(key: string, sourceName: string) {
    const fileConfig = await this.configSourceManager.load(sourceName);

    _.unset(fileConfig, key);

    await this.configSourceManager.write(sourceName, fileConfig);
  }
}
