import {
  ConfigDefinition,
  ConfigDefinitions,
} from '@/config/ConfigDefinitions';

interface ValidationError {
  key: string;
  error: 'Missing' | 'WrongType' | 'MissingDefinition';
  message: string;
}

type Config = { [key: string]: unknown };

interface ConfigValidatorProps {
  definitions: ConfigDefinitions;
}

export default class ConfigValidator {
  private definitions: ConfigDefinitions;

  constructor({ definitions }: ConfigValidatorProps) {
    this.definitions = definitions;
  }

  private getDefinition(key: string): ConfigDefinition | null {
    if (!key.includes('.')) {
      return this.definitions[key] || null;
    }

    const keys = key.split('.');
    let currentDef: ConfigDefinition | undefined = this.definitions[keys[0]];

    for (let i = 1; i < keys.length; i++) {
      if (!currentDef || currentDef.type !== 'object' || !currentDef.fields) {
        return null;
      }
      currentDef = currentDef.fields[keys[i]];
    }

    return currentDef || null;
  }

  private validateType(value: unknown, definition: ConfigDefinition): boolean {
    if (definition.type === 'object') {
      return this.validateObjectType(value, definition.fields);
    }

    if (!definition.type.includes('|') && !definition.type.includes('array')) {
      return typeof value === definition.type;
    }

    if (
      definition.type.startsWith('array<') &&
      !definition.type.includes('>|')
    ) {
      return this.validateArrayType(value, definition);
    }

    return this.validateCompostType(value, definition);
  }

  private validateCompostType(
    value: unknown,
    definition: ConfigDefinition,
  ): boolean {
    const types = definition.type.split('|');

    return types.some((t) => {
      if (t.startsWith('array<')) {
        return this.validateArrayType(value, { type: t });
      }
      return typeof value === t;
    });
  }

  private validateArrayType(
    value: unknown,
    definition: ConfigDefinition,
  ): boolean {
    if (!Array.isArray(value)) return false;

    const innerType = definition.type.match(/array<(.+)>/)?.[1];
    if (!innerType) {
      throw new Error(`Invalid array type`);
    }

    const result = value.every((item) =>
      this.validateType(item, { type: innerType, fields: definition.fields }),
    );
    return result;
  }

  private validateObjectType(
    value: unknown,
    fields?: ConfigDefinitions,
  ): boolean {
    if (typeof value !== 'object' || value === null || Array.isArray(value))
      return false;

    if (!fields) {
      throw new Error('Fields is not defined');
    }

    const obj = value as Record<string, unknown>;

    for (const [key, fieldDef] of Object.entries(fields)) {
      const fieldValue = obj[key];

      if (fieldValue === undefined || fieldValue === null) {
        if (fieldDef.required) {
          return false;
        }
      } else if (!this.validateType(fieldValue, fieldDef)) {
        return false;
      }
    }

    return true;
  }

  public validate(config: Config): {
    valid: boolean;
    errors: ValidationError[];
  } {
    const errors: ValidationError[] = [];

    for (const key in this.definitions) {
      const validationResult = this.validateKey(key, config[key]);

      if (validationResult.error) {
        errors.push(validationResult.error);
      }
    }

    return { valid: errors.length === 0, errors };
  }

  public validateKey(
    key: string,
    value: unknown,
  ): { valid: boolean; error?: ValidationError } {
    const definition = this.getDefinition(key);

    if (!definition) {
      return {
        valid: false,
        error: {
          key,
          error: 'MissingDefinition',
          message: `The definition for the "${key}" property is missing`,
        },
      };
    }

    if (!value && definition.required) {
      return {
        valid: false,
        error: {
          key,
          error: 'Missing',
          message: `The "${key}" property is required`,
        },
      };
    }

    if (value && !this.validateType(value, definition)) {
      return {
        valid: false,
        error: {
          key,
          error: 'WrongType',
          message: `The "${key}" property must be of type ${definition.type}`,
        },
      };
    }

    return { valid: true };
  }
}
