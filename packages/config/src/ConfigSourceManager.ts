import IConfigLoader from '@/types/IConfigLoader';
import { IConfigValue } from '@/types/IConfigValue';
import { ISource } from '@/types/ISource';

interface ConfigSourceManagerProps {
  sources: Array<ISource>;
  loaders: Record<string, IConfigLoader>;
}

const defaultSources: Array<ISource> = [{ name: 'env', type: 'env' }];

export default class ConfigSourceManager {
  private sources: Array<ISource>;
  private loaders: Record<string, IConfigLoader>;

  constructor({ sources = defaultSources, loaders }: ConfigSourceManagerProps) {
    this.sources = sources;
    this.loaders = loaders;

    this.validateSources(sources);
  }

  public getSource(sourceName: string): ISource | undefined {
    return this.sources.find((source) => source.name === sourceName);
  }

  public getSources(): Array<ISource> {
    return this.sources;
  }

  public setSources(sources: Array<ISource>): void {
    this.validateSources(sources);
    this.sources = sources;
  }

  private validateSources(sources: Array<ISource>) {
    if (sources.length === 0)
      throw new Error('Config Error: No sources specified');

    sources.forEach((source) => {
      const loader = this.loaders[source.type];

      if (!loader)
        throw new Error(`No loader defined for source type "${source.type}". `);

      loader.validate(source);
    });
  }

  private ensureSourceExists(sourceName: string): ISource {
    const source = this.getSource(sourceName);
    if (!source) {
      throw new Error(
        `Config Error: No source with name "${sourceName}" found`,
      );
    }
    return source;
  }

  public isWritableSource(sourceName: string): boolean {
    const source = this.getSource(sourceName);

    if (!source) return false;

    const loader = this.loaders[source.type];

    return loader.isWritable;
  }

  public async load(sourceName: string): Promise<IConfigValue> {
    const source = this.ensureSourceExists(sourceName);

    const loader = this.loaders[source.type];

    return await loader.load(source);
  }

  public async write(sourceName: string, config: IConfigValue): Promise<void> {
    const source = this.ensureSourceExists(sourceName);

    if (!this.isWritableSource(sourceName)) {
      throw new Error(
        `Config Error: The source "${sourceName}" is not writable`,
      );
    }

    const loader = this.loaders[source.type];

    await loader.write!(source, config);
  }
}
