import { ConfigValue } from '@/types/ConfigValue';

export default interface IConfig {
  loadConfig(): Promise<ConfigValue>;
  get(key: string): Promise<unknown>;
  set(key: string, value: string, sourceName: string): Promise<void>;
  unset(key: string, sourceName: string): Promise<void>;
}
