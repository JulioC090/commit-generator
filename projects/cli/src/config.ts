import createConfigManager, { ConfigSource } from '@commit-generator/config';
import path from 'node:path';

const configFileName = '.commitgen.json';
const configFilePath = path.join(__dirname, '..', configFileName);

const sources: Array<ConfigSource> = [
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

const configDefinitions = {
  openaiKey: {
    type: 'string',
    required: true,
  },
  excludeFiles: {
    type: 'array<string>',
    required: false,
  },
};

const configManager = createConfigManager({
  sources,
  definitions: configDefinitions,
});

export default configManager;
