export type ConfigType = string;

export type ConfigDefinition = {
  required?: boolean;
  type: ConfigType;
};

export type ConfigDefinitions = {
  [key: string]: ConfigDefinition;
};
