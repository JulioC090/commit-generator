import Ajv, { ErrorObject, JSONSchemaType, ValidateFunction } from 'ajv';

interface ConfigValidatorProps<IConfigType> {
  definitions: JSONSchemaType<IConfigType>;
}

interface ValidateOutput {
  valid: boolean;
  errors: Array<ErrorObject>;
}

export default class ConfigValidator<IConfigType> {
  private definitions: JSONSchemaType<IConfigType>;
  private ajv: Ajv;
  private validateFunction: ValidateFunction<IConfigType>;

  constructor({ definitions }: ConfigValidatorProps<IConfigType>) {
    this.definitions = definitions;
    this.ajv = new Ajv();
    this.validateFunction = this.ajv.compile(definitions);
  }

  public validate(config: unknown): ValidateOutput {
    const isValid = this.validateFunction(config);
    return {
      valid: isValid,
      errors: this.validateFunction.errors ? this.validateFunction.errors : [],
    };
  }

  public validateKey(key: string, value: unknown): ValidateOutput {
    const path = key.toString().split('.');

    let keySchema: JSONSchemaType<IConfigType> | undefined = this.definitions;

    for (const segment of path) {
      if (
        keySchema &&
        'properties' in keySchema &&
        keySchema.properties &&
        segment in keySchema.properties
      ) {
        keySchema = keySchema.properties[segment] as JSONSchemaType<unknown>;
      } else {
        throw new Error(
          `The key "${String(key)}" is not defined in the schema.`,
        );
      }
    }

    const validate = this.ajv.compile(keySchema);

    const isValid = validate(value);
    return {
      valid: isValid,
      errors: validate.errors ? validate.errors : [],
    };
  }
}
