import { ConfigValue } from '@/types/ConfigValue';

export default interface IConfig<IConfigType> {
  loadConfig(): Promise<ConfigValue>;
  get(key: string): Promise<unknown>;
  set<K extends keyof IConfigType>(
    key: K,
    value: unknown,
    sourceName: string,
  ): Promise<void>;
  unset(key: string, sourceName: string): Promise<void>;
}
