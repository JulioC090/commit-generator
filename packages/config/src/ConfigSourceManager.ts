import ArgConfigLoader from '@/loaders/ArgConfigLoader';
import EnvConfigLoader from '@/loaders/EnvConfigLoader';
import FileConfigLoader from '@/loaders/FileConfigLoader';
import { ConfigValue } from '@/types/ConfigValue';
import { Source } from '@/types/Source';

interface ConfigSourceManagerProps {
  sources: Array<Source>;
  fileConfigLoader: FileConfigLoader;
  envConfigLoader: EnvConfigLoader;
  argConfigLoader: ArgConfigLoader;
}

const defaultSources: Array<Source> = [{ name: 'env', type: 'env' }];

export default class ConfigSourceManager {
  private sources: Array<Source>;
  private fileConfigLoader: FileConfigLoader;
  private envConfigLoader: EnvConfigLoader;
  private argConfigLoader: ArgConfigLoader;

  constructor({
    sources = defaultSources,
    fileConfigLoader,
    envConfigLoader,
    argConfigLoader,
  }: ConfigSourceManagerProps) {
    this.validateSources(sources);

    this.sources = sources;
    this.fileConfigLoader = fileConfigLoader;
    this.envConfigLoader = envConfigLoader;
    this.argConfigLoader = argConfigLoader;
  }

  getSource(sourceName: string): Source | undefined {
    return this.sources.find((source) => source.name === sourceName);
  }

  getSources(): Array<Source> {
    return this.sources;
  }

  setSources(sources: Array<Source>): void {
    this.validateSources(sources);
    this.sources = sources;
  }

  private validateSources(sources: Array<Source>) {
    if (sources.length === 0)
      throw new Error('Config Error: No sources specified');

    sources.forEach((source) => {
      if (source.type === 'file' && !source.path)
        throw new Error(
          `Config Error: Source of type "file" must have a "path": ${source.name}`,
        );
    });
  }

  private ensureSourceExists(sourceName: string): Source {
    const source = this.getSource(sourceName);
    if (!source) {
      throw new Error(
        `Config Error: No source with name "${sourceName}" found`,
      );
    }
    return source;
  }

  isWritableSource(sourceName: string): boolean {
    const source = this.getSource(sourceName);
    return !!source && source.type === 'file';
  }

  async load(sourceName: string): Promise<ConfigValue> {
    const source = this.ensureSourceExists(sourceName);

    switch (source.type) {
      case 'file':
        return await this.fileConfigLoader.load(source.path!);
      case 'env':
        return await this.envConfigLoader.load();
      case 'arg':
        return await this.argConfigLoader.load();
    }
  }

  async write(sourceName: string, config: ConfigValue): Promise<void> {
    const source = this.ensureSourceExists(sourceName);

    if (!this.isWritableSource(sourceName)) {
      throw new Error(
        `Config Error: The source "${sourceName}" is not writable`,
      );
    }

    await this.fileConfigLoader.write(source.path!, config);
  }
}
