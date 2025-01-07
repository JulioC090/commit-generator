import IConfig from '@/config/IConfig';
import fs from 'node:fs/promises';

export default class FileConfigLoader {
  async load(filePath: string): Promise<Partial<IConfig>> {
    try {
      const fileContent = await fs.readFile(filePath, { encoding: 'utf8' });
      return JSON.parse(fileContent) as Partial<IConfig>;
    } catch (error) {
      console.error(
        `Failed to load or parse config file at ${filePath}`,
        error,
      );
      return {};
    }
  }

  async write(filePath: string, config: Partial<IConfig>): Promise<void> {
    await fs.writeFile(filePath, JSON.stringify(config, null, 2), {
      encoding: 'utf8',
    });
  }
}
