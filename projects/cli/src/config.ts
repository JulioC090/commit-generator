import createConfigManager, {
  ConfigDefinitions,
  ConfigSource,
} from '@commit-generator/config';
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

export interface IConfigType {
  openaiKey: string;
  excludeFiles?: string[];
}

const configDefinitions: ConfigDefinitions<IConfigType> = {
  type: 'object',
  properties: {
    openaiKey: { type: 'string' },
    excludeFiles: { type: 'array', items: { type: 'string' }, nullable: true },
  },
  required: ['openaiKey'],
  additionalProperties: false,
};

const configManager = createConfigManager({
  sources,
  definitions: configDefinitions,
});

export default configManager;
