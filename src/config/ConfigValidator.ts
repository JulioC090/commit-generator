import { ConfigDefinitions, ConfigType } from '@/config/ConfigDefinitions';

interface ValidationError {
  key: string;
  error: 'Missing' | 'WrongType';
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

  validate(config: Config): {
    valid: boolean;
    errors: ValidationError[];
  } {
    const errors: ValidationError[] = [];

    for (const key in this.definitions) {
      if (!config[key] && this.definitions[key].required) {
        errors.push({
          key,
          error: 'Missing',
          message: `The "${key}" property is required`,
        });

        continue;
      }

      if (
        config[key] &&
        !this.validateType(config[key], this.definitions[key].type)
      ) {
        errors.push({
          key,
          error: 'WrongType',
          message: `The "${key}" property must be of type ${this.definitions[key].type}`,
        });

        continue;
      }
    }

    return { valid: errors.length === 0, errors };
  }

  private validateType(value: unknown, type: ConfigType): boolean {
    return typeof value === type;
  }
}
