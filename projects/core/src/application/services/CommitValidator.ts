import IAIModel from '@/application/interfaces/IAIModel';
import ICommitInfo from '@/application/interfaces/ICommitInfo';
import ICommitValidator, {
  IValidateResult,
} from '@/application/interfaces/ICommitValidator';
import validatePrompt from '@/application/utils/prompts/validatePrompt';
import normalizeJson from '@/application/utils/sanitizers/normalizeJson';
import sanitize from '@/application/utils/sanitizers/sanitize';

export default class CommitValidator implements ICommitValidator {
  constructor(private aiModel: IAIModel) {}

  async validate(
    commitMessage: string,
    commitInfo: ICommitInfo,
  ): Promise<IValidateResult> {
    const complete = await this.aiModel.complete(
      validatePrompt(commitMessage, commitInfo),
    );

    const sanitizedResponse = sanitize(complete);
    const normalizedResponse = normalizeJson(sanitizedResponse);

    try {
      const result = JSON.parse(normalizedResponse) as IValidateResult;
      return result;
    } catch {
      throw new Error(`Invalid AI response: ${normalizedResponse}`);
    }
  }
}
