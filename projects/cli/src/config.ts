import createConfigManager, {
  IConfigDefinitions,
  IConfigSource,
} from '@commit-generator/config';
import {
  aiModelSchemes,
  IAIModelSchemes,
} from '@commit-generator/core/schemes';
import path from 'node:path';

const configFileName = '.commitgen.json';
const configFilePath = path.join(__dirname, '..', configFileName);

const sources: Array<IConfigSource> = [
  {
    name: 'local',
    type: 'file',
    path: configFilePath,
  },
  {
    name: 'env',
    type: 'env',
    prefix: 'commit_gen_config_',
  },
  {
    name: 'arg',
    type: 'arg',
  },
];

export type IConfigType = {
  provider: keyof IAIModelSchemes;
  exclude?: { files: Array<string> };
} & Partial<IAIModelSchemes>;

const providers = Object.entries(aiModelSchemes).map(([provider, schema]) => ({
  properties: {
    provider: { const: provider },
    [provider]: schema,
  },
  required: [provider],
}));

const configDefinitions = {
  type: 'object',
  properties: {
    provider: { type: 'string' },
    ...aiModelSchemes,
    exclude: {
      type: 'object',
      properties: {
        files: { type: 'array', items: { type: 'string' } },
      },
      required: ['files'],
      additionalProperties: false,
    },
  },
  required: ['provider'],
  anyOf: providers,
  additionalProperties: false,
};

const configManager = createConfigManager({
  sources,
  definitions: configDefinitions as unknown as IConfigDefinitions<IConfigType>,
});

export default configManager;
