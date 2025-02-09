import { IConfigValue } from '@/types/IConfigValue';

export default interface IConfig<IConfigType> {
  loadConfig(): Promise<IConfigValue>;
  get(key: string): Promise<unknown>;
  set<K extends keyof IConfigType>(
    key: K,
    value: unknown,
    sourceName: string,
  ): Promise<void>;
  unset(key: string, sourceName: string): Promise<void>;
}
