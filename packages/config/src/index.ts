import ConfigManager from '@/ConfigManager';
import ConfigSourceManager from '@/ConfigSourceManager';
import ConfigValidator from '@/ConfigValidator';
import ArgConfigLoader from '@/loaders/ArgConfigLoader';
import EnvConfigLoader from '@/loaders/EnvConfigLoader';
import FileConfigLoader from '@/loaders/FileConfigLoader';
import { ConfigDefinitions } from '@/types/ConfigDefinitions';
import { ISource } from '@/types/ISource';

interface createConfigManagerProps<IConfigType> {
  sources: Array<ISource>;
  definitions: ConfigDefinitions<IConfigType>;
}

export default function createConfigManager<IConfigType>({
  sources,
  definitions,
}: createConfigManagerProps<IConfigType>): ConfigManager<IConfigType> {
  const fileConfigLoader = new FileConfigLoader();
  const envConfigLoader = new EnvConfigLoader();
  const argConfigLoader = new ArgConfigLoader();

  const configSourceManager = new ConfigSourceManager({
    sources,
    loaders: {
      file: fileConfigLoader,
      env: envConfigLoader,
      arg: argConfigLoader,
    },
  });

  const configValidator = new ConfigValidator<IConfigType>({ definitions });

  const configManager = new ConfigManager<IConfigType>({
    configSourceManager,
    configValidator,
  });

  return configManager;
}

export { default as ConfigManager } from '@/ConfigManager';
export { default as formatConfigValue } from '@/formatConfigValue';
export { ConfigDefinitions as IConfigDefinitions } from '@/types/ConfigDefinitions';
export { ISource as IConfigSource } from '@/types/ISource';
