import { ConfigValue } from '@/config/types/ConfigValue';
import fs from 'node:fs/promises';

export default class FileConfigLoader {
  async load(filePath: string): Promise<ConfigValue> {
    try {
      const fileContent = await fs.readFile(filePath, { encoding: 'utf8' });
      return JSON.parse(fileContent) as ConfigValue;
    } catch (error) {
      console.error(
        `Failed to load or parse config file at ${filePath}`,
        error,
      );
      return {};
    }
  }

  async write(filePath: string, config: ConfigValue): Promise<void> {
    await fs.writeFile(filePath, JSON.stringify(config, null, 2), {
      encoding: 'utf8',
    });
  }
}
