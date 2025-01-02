import fs from 'node:fs/promises';
import path from 'node:path';

interface Config {
  openAIKey: string;
  excludeFiles: string[];
}

const configFileName = '.commitgen.json';

async function loadConfigFile(filePath: string): Promise<Partial<Config>> {
  const fileContent: string = await fs.readFile(filePath, { encoding: 'utf8' });

  return JSON.parse(fileContent) as Partial<Config>;
}

export async function loadConfig(): Promise<Partial<Config>> {
  const fileConfig = await loadConfigFile(
    path.join(__dirname, '../..', configFileName),
  );

  return {
    ...fileConfig,
    openAIKey: process.env.OPENAI_KEY || '',
  } as Partial<Config>;
}
