import fs from 'node:fs/promises';
import path from 'node:path';

interface Config {
  openaiKey: string;
  excludeFiles: string[];
}

export default class ConfigManager {
  private readonly configFileName = '.commitgen.json';
  private readonly configFilePath = path.join(
    __dirname,
    '../..',
    this.configFileName,
  );

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
    const envConfig = await this.loadEnvConfig();

    const fileConfig = await this.loadConfigFile(this.configFilePath);

    return {
      ...fileConfig,
      ...envConfig,
    } as Partial<Config>;
  }

  async saveConfig(key: keyof Config, value: string) {
    const fileConfig: { [key: string]: unknown } = await this.loadConfigFile(
      this.configFilePath,
    );

    if (value.includes(',')) {
      fileConfig[key] = value.split(',');
    } else {
      fileConfig[key] = value;
    }

    await fs.writeFile(
      this.configFilePath,
      JSON.stringify(fileConfig, null, 2),
    );
  }

  async removeConfig(key: string) {
    const fileConfig: { [key: string]: unknown } = await this.loadConfigFile(
      this.configFilePath,
    );

    delete fileConfig[key];

    await fs.writeFile(
      this.configFilePath,
      JSON.stringify(fileConfig, null, 2),
    );
  }
}
