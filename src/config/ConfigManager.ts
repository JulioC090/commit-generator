import { Source } from '@/config/Source';
import fs from 'node:fs/promises';

interface Config {
  openaiKey: string;
  excludeFiles: string[];
}

interface ConfigManagerProps {
  sources: Array<Source>;
}

const defaultSources: Array<Source> = [{ name: 'env', type: 'env' }];

export default class ConfigManager {
  private sources: Array<Source>;
  private allConfigs = new Map<string, Partial<Config>>();
  private config: Partial<Config> = {};

  constructor({ sources = defaultSources }: ConfigManagerProps) {
    if (sources.length === 0)
      throw new Error('Config Error: No sources specified');

    sources.forEach((source) => {
      if (source.type === 'file' && !source.path)
        throw new Error(
          `Config Error: Source of type "file" must have a "path": ${source.name}`,
        );
    });

    this.sources = sources;
  }

  async loadConfigFile(filePath: string): Promise<Partial<Config>> {
    try {
      const fileContent: string = await fs.readFile(filePath, {
        encoding: 'utf8',
      });
      return JSON.parse(fileContent) as Partial<Config>;
    } catch {
      return {};
    }
  }

  async loadEnvConfig(): Promise<Partial<Config>> {
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

  async loadConfig(): Promise<Partial<Config>> {
    for (const source of this.sources) {
      let config;
      if (source.type === 'file') {
        config = await this.loadConfigFile(source.path!);
      } else if (source.type === 'env') {
        config = await this.loadEnvConfig();
      } else {
        throw new Error(
          `Config Error: Source of type "${source.type}" is not supported`,
        );
      }
      this.config = { ...this.config, ...config };
    }

    return this.config;
  }

  async saveConfig(key: keyof Config, value: string, scope: string) {
    const validSource = this.sources.find((source) => source.name === scope);

    if (!validSource)
      throw new Error(`Config Error: No source with name "${scope}" found`);

    if (validSource.type !== 'file')
      throw new Error(
        `Config Error: The source "${validSource.name}" is not writable`,
      );

    const fileConfig: { [key: string]: unknown } = await this.loadConfigFile(
      validSource.path!,
    );

    if (value.includes(',')) {
      fileConfig[key] = value.split(',');
    } else {
      fileConfig[key] = value;
    }

    await fs.writeFile(validSource.path!, JSON.stringify(fileConfig, null, 2));
  }

  async removeConfig(key: string, scope: string) {
    const validSource = this.sources.find((source) => source.name === scope);

    if (!validSource)
      throw new Error(`Config Error: No source with name "${scope}" found`);

    if (validSource.type !== 'file')
      throw new Error(
        `Config Error: The source "${validSource.name}" is not writable`,
      );

    const fileConfig: { [key: string]: unknown } = await this.loadConfigFile(
      validSource.path!,
    );

    delete fileConfig[key];

    await fs.writeFile(validSource.path!, JSON.stringify(fileConfig, null, 2));
  }
}
