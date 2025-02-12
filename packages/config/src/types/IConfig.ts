export default interface IConfig<IConfigType> {
  loadConfig(): Promise<IConfigType>;
  get(key: string): Promise<unknown>;
  set(key: string, value: unknown, sourceName: string): Promise<void>;
  unset(key: string, sourceName: string): Promise<void>;
}
