import { IAIModelParams } from '@/application/interfaces/IAIModel';
import ISchemeValidator from '@/application/interfaces/ISchemeValidator';
import AjvSchemeValidator from '@/infrastructure/scheme-validator/AjvSchemeValidator';

export default abstract class AIModel {
  protected parameters: IAIModelParams;
  private schemeValidator: ISchemeValidator;

  constructor(parameters: IAIModelParams, scheme: unknown) {
    this.parameters = parameters;
    this.schemeValidator = new AjvSchemeValidator();
    if (!this.validateParameters(parameters, scheme)) {
      throw new Error(`Invalid parameters`);
    }
  }

  private validateParameters(
    parameters: IAIModelParams,
    schema: unknown,
  ): boolean {
    return this.schemeValidator.validate(parameters, schema);
  }
}
