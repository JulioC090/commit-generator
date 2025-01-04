import ConfigManager from '@/config/ConfigManager';
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
];

const configManager = new ConfigManager({ sources });

export default configManager;
