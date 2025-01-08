import { ConfigDefinitions } from '@/config/ConfigDefinitions';

interface ValidationError {
  key: string;
  error: 'Missing';
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
      }
    }

    return { valid: errors.length === 0, errors };
  }
}
