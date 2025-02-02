import formatConfigValue from '@/formatConfigValue';
import { ConfigValue } from '@/types/ConfigValue';

interface ArgConfigLoaderProps {
  arg?: Array<string>;
}

export default class ArgConfigLoader {
  private arg: Array<string>;

  constructor(props?: ArgConfigLoaderProps) {
    this.arg = props?.arg || process.argv.slice(2);
  }

  async load(): Promise<ConfigValue> {
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
