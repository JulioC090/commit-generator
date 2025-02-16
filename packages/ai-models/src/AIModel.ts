import AjvSchemeValidator from '@/AjvSchemeValidator';
import IAIModel from '@/types/IAIModel';
import { IAIModelParams } from '@/types/IAIModelsParams';
import ISchemeValidator from '@/types/ISchemeValidator';

export default abstract class AIModel<ParamsType> implements IAIModel {
  protected parameters: ParamsType;
  private schemeValidator: ISchemeValidator;

  constructor(parameters: IAIModelParams, scheme: unknown) {
    this.parameters = parameters as ParamsType;
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

  public abstract complete(prompt: string): Promise<string>;
}
