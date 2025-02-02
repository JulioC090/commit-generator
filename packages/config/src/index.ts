import ConfigManager from '@/ConfigManager';
import ConfigSourceManager from '@/ConfigSourceManager';
import ConfigValidator from '@/ConfigValidator';
import ArgConfigLoader from '@/loaders/ArgConfigLoader';
import EnvConfigLoader from '@/loaders/EnvConfigLoader';
import FileConfigLoader from '@/loaders/FileConfigLoader';
import { ConfigDefinitions } from '@/types/ConfigDefinitions';
import { Source } from '@/types/Source';
import path from 'node:path';

const configFileName = '.commitgen.json';
const configFilePath = path.join(__dirname, '../..', configFileName);

const sources: Array<Source> = [
  {
    name: 'local',
    type: 'file',
    path: configFilePath,
  },
  {
    name: 'env',
    type: 'env',
  },
  {
    name: 'arg',
    type: 'arg',
  },
];

const configDefinitions: ConfigDefinitions = {
  openaiKey: {
    type: 'string',
    required: true,
  },
  excludeFiles: {
    type: 'array<string>',
    required: false,
  },
};

const fileConfigLoader = new FileConfigLoader();
const envConfigLoader = new EnvConfigLoader();
const argConfigLoader = new ArgConfigLoader();

const configSourceManager = new ConfigSourceManager({
  sources,
  fileConfigLoader,
  envConfigLoader,
  argConfigLoader,
});

const configValidator = new ConfigValidator({ definitions: configDefinitions });

const configManager = new ConfigManager({
  configSourceManager,
  configValidator,
});

export default configManager;
