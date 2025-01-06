import ArgConfigLoader from '@/config/ArgConfigLoader';
import ConfigManager from '@/config/ConfigManager';
import ConfigSourceManager from '@/config/ConfigSourceManager';
import EnvConfigLoader from '@/config/EnvConfigLoader';
import FileConfigLoader from '@/config/FileConfigLoader';
import { Source } from '@/config/Source';
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

const fileConfigLoader = new FileConfigLoader();
const envConfigLoader = new EnvConfigLoader();
const argConfigLoader = new ArgConfigLoader();
const configSourceManager = new ConfigSourceManager({
  sources,
  fileConfigLoader,
  envConfigLoader,
  argConfigLoader,
});

const configManager = new ConfigManager({ configSourceManager });

export default configManager;
