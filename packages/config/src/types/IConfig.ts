import { IConfigValue } from '@/types/IConfigValue';

export default interface IConfig {
  loadConfig(): Promise<IConfigValue>;
  get(key: string): Promise<unknown>;
  set(key: string, value: unknown, sourceName: string): Promise<void>;
  unset(key: string, sourceName: string): Promise<void>;
}
