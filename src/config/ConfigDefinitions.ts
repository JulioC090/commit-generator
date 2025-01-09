type Primitive = 'string' | 'number' | 'boolean';

export type ConfigType =
  | Primitive
  | `${Primitive}|${Primitive}`
  | `${Primitive}|${Primitive}|${Primitive}`;

export type ConfigDefinition = {
  required?: boolean;
  type: ConfigType;
};

export type ConfigDefinitions = {
  [key: string]: ConfigDefinition;
};
