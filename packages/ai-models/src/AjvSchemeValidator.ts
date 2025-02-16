import ISchemeValidator from '@/types/ISchemeValidator';
import Ajv, { JSONSchemaType } from 'ajv';

export default class AjvSchemeValidator implements ISchemeValidator {
  private ajv: Ajv;

  constructor() {
    this.ajv = new Ajv();
  }

  validate<T>(values: unknown, scheme: JSONSchemaType<T>): boolean {
    const validate = this.ajv.compile(scheme);
    return validate(values);
  }
}
