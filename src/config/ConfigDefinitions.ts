export type ConfigType = 'string' | 'number' | 'boolean';

export type ConfigDefinition = {
  required?: boolean;
  type: ConfigType;
};

export type ConfigDefinitions = {
  [key: string]: ConfigDefinition;
};
