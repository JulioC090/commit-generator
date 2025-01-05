import FileConfigLoader from '@/config/FileConfigLoader';
import IConfig from '@/config/IConfig';
import { Source } from '@/config/Source';

interface ConfigManagerProps {
  sources: Array<Source>;
  fileConfigLoader?: FileConfigLoader;
}

const defaultSources: Array<Source> = [{ name: 'env', type: 'env' }];

export default class ConfigManager {
  private sources: Array<Source>;
  private allConfigsLoaded = new Map<string, Partial<IConfig>>();
  private config: Partial<IConfig> = {};
  private isLoaded = false;

  private fileConfigLoader;

  constructor({
    sources = defaultSources,
    fileConfigLoader = new FileConfigLoader(),
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
  }

  private async loadSource(source: Source) {
    if (source.type === 'file') {
      return await this.fileConfigLoader.load(source.path!);
    } else if (source.type === 'env') {
      return await this.loadEnvConfig();
    } else {
      throw new Error(
        `Config Error: Source of type "${source.type}" is not supported`,
      );
    }
  }

  async loadEnvConfig(): Promise<Partial<IConfig>> {
    const conf = Object.create(null);

    for (const [envKey, envValue] of Object.entries(process.env)) {
      if (!/^commit_gen_config_/i.test(envKey) || !envValue) {
        continue;
      }

      const key = envKey
        .slice('commit_gen_config_'.length)
        .toLowerCase()
        .replace(/_(.)/g, (_, char) => char.toUpperCase());

      if (envValue.includes(',')) {
        conf[key] = envValue.split(',');
      } else {
        conf[key] = envValue;
      }
    }

    return conf;
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

    if (value.includes(',')) {
      fileConfig[key] = value.split(',');
    } else {
      fileConfig[key] = value;
    }

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
