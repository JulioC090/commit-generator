import IConfigLoader from '@/types/IConfigLoader';
import { IConfigValue } from '@/types/IConfigValue';
import { ISource } from '@/types/ISource';
import fs from 'node:fs/promises';

export default class FileConfigLoader implements IConfigLoader {
  public readonly isWritable: boolean = true;

  public validate(source: ISource): void {
    if (!source.path)
      throw new Error(
        `Config Error: Source of type "file" must have a "path": ${source.name}`,
      );
  }

  public async load(source: ISource): Promise<IConfigValue> {
    try {
      const fileContent = await fs.readFile(source.path!, { encoding: 'utf8' });
      return JSON.parse(fileContent) as IConfigValue;
    } catch (error) {
      console.error(
        `Failed to load or parse config file at ${source.path!}`,
        error,
      );
      return {};
    }
  }

  public async write(source: ISource, config: IConfigValue): Promise<void> {
    await fs.writeFile(source.path!, JSON.stringify(config, null, 2), {
      encoding: 'utf8',
    });
  }
}
