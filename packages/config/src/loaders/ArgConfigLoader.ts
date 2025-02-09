import formatConfigValue from '@/formatConfigValue';
import IConfigLoader from '@/types/IConfigLoader';
import { IConfigValue } from '@/types/IConfigValue';

interface ArgConfigLoaderProps {
  arg?: Array<string>;
}

export default class ArgConfigLoader implements IConfigLoader {
  public readonly isWritable: boolean = false;
  private arg: Array<string>;

  constructor(props?: ArgConfigLoaderProps) {
    this.arg = props?.arg || process.argv.slice(2);
  }

  public validate(): void {
    return;
  }

  async load(): Promise<IConfigValue> {
    const config = Object.create(null);

    this.arg.forEach((arg) => {
      const match = arg.match(/^--([^=]+)=(.+)$/);
      if (match) {
        const [, key, value] = match;
        config[key] = formatConfigValue(value);
      }
    });

    return config;
  }
}
