import fs from 'node:fs/promises';
import path from 'node:path';

interface Config {
  openaiKey: string;
  excludeFiles: string[];
}

const configFileName = '.commitgen.json';
const configFilePath = path.join(__dirname, '../..', configFileName);

async function loadConfigFile(filePath: string): Promise<Partial<Config>> {
  const fileContent: string = await fs.readFile(filePath, { encoding: 'utf8' });

  return JSON.parse(fileContent) as Partial<Config>;
}

async function loadEnvConfig(): Promise<Partial<Config>> {
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

export async function loadConfig(): Promise<Partial<Config>> {
  const envConfig = await loadEnvConfig();

  const fileConfig = await loadConfigFile(configFilePath);

  return {
    ...fileConfig,
    ...envConfig,
  } as Partial<Config>;
}

export async function saveConfig(key: keyof Config, value: string) {
  const fileConfig: { [key: string]: unknown } =
    await loadConfigFile(configFilePath);

  if (value.includes(',')) {
    fileConfig[key] = value.split(',');
  } else {
    fileConfig[key] = value;
  }

  await fs.writeFile(configFilePath, JSON.stringify(fileConfig, null, 2));
}

export async function removeConfig(key: string) {
  const fileConfig: { [key: string]: unknown } =
    await loadConfigFile(configFilePath);

  delete fileConfig[key];

  await fs.writeFile(configFilePath, JSON.stringify(fileConfig, null, 2));
}
