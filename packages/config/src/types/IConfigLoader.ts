import { IConfigValue } from '@/types/IConfigValue';
import { ISource } from '@/types/ISource';

export default interface IConfigLoader {
  isWritable: boolean;
  validate(source: ISource): void;
  load(source: ISource): Promise<IConfigValue>;
  write?(source: ISource, config: IConfigValue): Promise<void>;
}
