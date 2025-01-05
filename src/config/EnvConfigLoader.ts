import formatConfigValue from '@/config/formatConfigValue';
import IConfig from '@/config/IConfig';

interface EnvConfigLoaderProps {
  env?: NodeJS.ProcessEnv;
  prefix?: string;
}

export default class EnvConfigLoader {
  private env: NodeJS.ProcessEnv;
  private prefix?: string;

  constructor(props?: EnvConfigLoaderProps) {
    this.env = props?.env || process.env;
    this.prefix = props?.prefix;
  }

  async load(): Promise<Partial<IConfig>> {
    const conf = Object.create(null);

    const prefixRegex = this.prefix ? new RegExp(`^${this.prefix}`, 'i') : null;

    for (const [envKey, envValue] of Object.entries(this.env)) {
      if (!envValue) continue;

      if (this.prefix && !prefixRegex?.test(envKey)) {
        continue;
      }

      let key = this.prefix ? envKey.slice(this.prefix.length) : envKey;
      key = key.toLowerCase().replace(/_(.)/g, (_, char) => char.toUpperCase());

      conf[key] = formatConfigValue(envValue);
    }

    return conf;
  }
}
