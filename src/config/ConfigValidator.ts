import {
  ConditionalRequired,
  ConfigDefinition,
  ConfigDefinitions,
} from '@/config/types/ConfigDefinitions';
import { ConfigValue } from '@/config/types/ConfigValue';

interface ValidationError {
  key: string;
  error: 'Missing' | 'WrongType' | 'MissingDefinition';
  message: string;
}

interface ConfigValidatorProps {
  definitions: ConfigDefinitions;
}

export default class ConfigValidator {
  private definitions: ConfigDefinitions;
  private conditionalRequirements: { [key: string]: ConditionalRequired } = {};

  constructor({ definitions }: ConfigValidatorProps) {
    this.definitions = definitions;
  }

  private getDefinition(key: string): ConfigDefinition | undefined {
    if (!key.includes('.')) {
      return this.definitions[key];
    }

    const keys = key.split('.');
    let currentDef: ConfigDefinition | undefined = this.definitions[keys[0]];

    for (let i = 1; i < keys.length; i++) {
      if (!currentDef || currentDef.type !== 'object' || !currentDef.fields) {
        return;
      }
      currentDef = currentDef.fields[keys[i]];
    }

    return currentDef;
  }

  private validateType(
    key: string,
    value: unknown,
    definition: ConfigDefinition,
  ): boolean {
    if (definition.conditionalRequired) {
      this.conditionalRequirements[key] = definition.conditionalRequired;
    }

    if (definition.type === 'object') {
      return this.validateObjectType(key, value, definition.fields);
    }

    if (!definition.type.includes('|') && !definition.type.includes('array')) {
      return typeof value === definition.type;
    }

    if (
      definition.type.startsWith('array<') &&
      !definition.type.includes('>|')
    ) {
      return this.validateArrayType(key, value, definition);
    }

    return this.validateCompostType(key, value, definition);
  }

  private validateCompostType(
    key: string,
    value: unknown,
    definition: ConfigDefinition,
  ): boolean {
    const types = definition.type.split('|');

    return types.some((t) => {
      if (t.startsWith('array<')) {
        return this.validateArrayType(key, value, { type: t });
      }
      return typeof value === t;
    });
  }

  private validateArrayType(
    key: string,
    value: unknown,
    definition: ConfigDefinition,
  ): boolean {
    if (!Array.isArray(value)) return false;

    const innerType = definition.type.match(/array<(.+)>/)?.[1];
    if (!innerType) {
      throw new Error(
        `Invalid array type for key "${key}". Expected an array with a specific type, but the type definition is incorrect or missing.`,
      );
    }

    const result = value.every((item) =>
      this.validateType(key, item, {
        type: innerType,
        fields: definition.fields,
      }),
    );
    return result;
  }

  private validateObjectType(
    key: string,
    value: unknown,
    fields?: ConfigDefinitions,
  ): boolean {
    if (typeof value !== 'object' || value === null || Array.isArray(value))
      return false;

    if (!fields) {
      throw new Error(`Fields definition is not provided for key "${key}".`);
    }

    const obj = value as Record<string, unknown>;

    for (const [fieldKey, fieldDef] of Object.entries(fields)) {
      const fieldValue = obj[fieldKey];

      if (fieldValue === undefined || fieldValue === null) {
        if (fieldDef.required) {
          return false;
        }
      } else if (
        !this.validateType(`${key}.${fieldKey}`, fieldValue, fieldDef)
      ) {
        return false;
      }
    }

    return true;
  }

  public validate(config: ConfigValue): {
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

    for (const [key, conditionalRequired] of Object.entries(
      this.conditionalRequirements,
    )) {
      const conditionalValue = conditionalRequired.key
        .split('.')
        .reduce<Record<string, unknown> | undefined>(
          (acc, key) => {
            if (acc === undefined) return undefined;
            return acc[key] as Record<string, unknown>;
          },
          config as Record<string, unknown>,
        );

      if (!conditionalValue || conditionalValue !== conditionalRequired.value) {
        continue;
      }

      if (
        key.split('.').reduce<Record<string, unknown> | undefined>(
          (acc, key) => {
            return acc![key] as Record<string, unknown>;
          },
          config as Record<string, unknown>,
        )
      ) {
        continue;
      }

      errors.push({
        key,
        error: 'Missing',
        message: `The "${key}" property is required when "${conditionalRequired.key}" is "${conditionalRequired.value}"`,
      });
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

    if (value && !this.validateType(key, value, definition)) {
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
