export type ConfigType = string;

export type ConditionalRequired = { key: string; value: unknown };

export type ConfigDefinition = {
  type: ConfigType;
  fields?: ConfigDefinitions;
  required?: boolean;
  conditionalRequired?: ConditionalRequired;
};

export type ConfigDefinitions = {
  [key: string]: ConfigDefinition;
};
