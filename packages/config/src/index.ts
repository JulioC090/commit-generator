import ConfigManager from '@/ConfigManager';
import ConfigSourceManager from '@/ConfigSourceManager';
import ConfigValidator from '@/ConfigValidator';
import ArgConfigLoader from '@/loaders/ArgConfigLoader';
import EnvConfigLoader from '@/loaders/EnvConfigLoader';
import FileConfigLoader from '@/loaders/FileConfigLoader';
import { ConfigDefinitions } from '@/types/ConfigDefinitions';
import { Source } from '@/types/Source';

interface createConfigManagerProps {
  sources: Array<Source>;
  definitions: ConfigDefinitions;
}

export default function createConfigManager({
  sources,
  definitions,
}: createConfigManagerProps): ConfigManager {
  const fileConfigLoader = new FileConfigLoader();
  const envConfigLoader = new EnvConfigLoader();
  const argConfigLoader = new ArgConfigLoader();

  const configSourceManager = new ConfigSourceManager({
    sources,
    fileConfigLoader,
    envConfigLoader,
    argConfigLoader,
  });

  const configValidator = new ConfigValidator({ definitions });

  const configManager = new ConfigManager({
    configSourceManager,
    configValidator,
  });

  return configManager;
}

export { default as ConfigManager } from '@/ConfigManager';
export { ConfigDefinitions } from '@/types/ConfigDefinitions';
export { Source as ConfigSource } from '@/types/Source';
