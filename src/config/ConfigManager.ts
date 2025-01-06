import EnvConfigLoader from '@/config/EnvConfigLoader';
import FileConfigLoader from '@/config/FileConfigLoader';
import formatConfigValue from '@/config/formatConfigValue';
import IConfig from '@/config/IConfig';
import { Source } from '@/config/Source';

interface ConfigManagerProps {
  sources: Array<Source>;
  fileConfigLoader?: FileConfigLoader;
  envConfigLoader?: EnvConfigLoader;
}

const defaultSources: Array<Source> = [{ name: 'env', type: 'env' }];

export default class ConfigManager {
  private sources: Array<Source>;
  private allConfigsLoaded = new Map<string, Partial<IConfig>>();
  private config: Partial<IConfig> = {};
  private isLoaded = false;

  private fileConfigLoader;
  private envConfigLoader;

  constructor({
    sources = defaultSources,
    fileConfigLoader = new FileConfigLoader(),
    envConfigLoader = new EnvConfigLoader({ prefix: 'commit_gen_config_' }),
  }: ConfigManagerProps) {
    if (sources.length === 0)
      throw new Error('Config Error: No sources specified');

    sources.forEach((source) => {
      if (source.type === 'file' && !source.path)
        throw new Error(
          `Config Error: Source of type "file" must have a "path": ${source.name}`,
        );
    });

    this.sources = sources;
    this.fileConfigLoader = fileConfigLoader;
    this.envConfigLoader = envConfigLoader;
  }

  private async loadSource(source: Source) {
    switch (source.type) {
      case 'file':
        return await this.fileConfigLoader.load(source.path!);
      case 'env':
        return await this.envConfigLoader.load();
      default:
        throw new Error(
          `Config Error: Source of type "${source.type}" is not supported`,
        );
    }
  }

  async loadConfig(): Promise<Partial<IConfig>> {
    if (this.isLoaded) return this.config;

    for (const source of this.sources) {
      const config = await this.loadSource(source);
      this.config = { ...this.config, ...config };
    }

    this.isLoaded = true;

    return this.config;
  }

  async get(key: string) {
    if (this.isLoaded) {
      return this.config[key as keyof IConfig] ?? undefined;
    }

    for (let i = this.sources.length - 1; i >= 0; i--) {
      const source = this.sources[i];

      if (!this.allConfigsLoaded.has(source.name)) {
        const config = await this.loadSource(source);
        this.allConfigsLoaded.set(source.name, config);
      }

      const cachedConfig = this.allConfigsLoaded.get(source.name)!;
      if (key in cachedConfig) {
        return cachedConfig[key as keyof IConfig];
      }
    }

    return undefined;
  }

  private getWritableSource(scope: string): Source {
    const validSource = this.sources.find((source) => source.name === scope);

    if (!validSource) {
      throw new Error(`Config Error: No source with name "${scope}" found`);
    }

    if (validSource.type !== 'file') {
      throw new Error(
        `Config Error: The source "${validSource.name}" is not writable`,
      );
    }

    return validSource;
  }

  async set(key: keyof IConfig, value: string, scope: string) {
    const validSource = this.getWritableSource(scope);

    const fileConfig: { [key: string]: unknown } =
      await this.fileConfigLoader.load(validSource.path!);

    fileConfig[key] = formatConfigValue(value);

    await this.fileConfigLoader.write(validSource.path!, fileConfig);
  }

  async unset(key: string, scope: string) {
    const validSource = this.getWritableSource(scope);

    const fileConfig: { [key: string]: unknown } =
      await this.fileConfigLoader.load(validSource.path!);

    delete fileConfig[key];

    await this.fileConfigLoader.write(validSource.path!, fileConfig);
  }
}
