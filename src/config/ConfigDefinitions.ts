export type ConfigType = string;

export type ConfigDefinition = {
  required?: boolean;
  type: ConfigType;
  fields?: ConfigDefinitions;
};

export type ConfigDefinitions = {
  [key: string]: ConfigDefinition;
};
