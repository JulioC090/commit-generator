import formatConfigValue from '@/formatConfigValue';
import IConfigLoader from '@/types/IConfigLoader';
import { IConfigValue } from '@/types/IConfigValue';
import { ISource } from '@/types/ISource';
import _ from 'lodash';

interface EnvConfigLoaderProps {
  env?: NodeJS.ProcessEnv;
  prefix?: string;
}

export default class EnvConfigLoader implements IConfigLoader {
  public readonly isWritable: boolean = false;
  private env: NodeJS.ProcessEnv;

  constructor(props?: EnvConfigLoaderProps) {
    this.env = props?.env || process.env;
  }

  public validate(): void {
    return;
  }

  public async load(source: ISource): Promise<IConfigValue> {
    const conf = Object.create(null);

    const prefixRegex = source.prefix
      ? new RegExp(`^${source.prefix}`, 'i')
      : null;

    for (const [envKey, envValue] of Object.entries(this.env)) {
      if (!envValue) continue;

      if (source.prefix && !prefixRegex?.test(envKey)) {
        continue;
      }

      let key = source.prefix ? envKey.slice(source.prefix.length) : envKey;
      key = key.toLowerCase().replace(/_/g, '.');

      _.set(conf, key, formatConfigValue(envValue));
    }

    return conf;
  }
}
