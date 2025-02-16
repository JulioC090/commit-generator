import validatePrompt from '@/prompts/validatePrompt';
import normalizeJson from '@/sanitizers/normalizeJson';
import sanitize from '@/sanitizers/sanitize';
import IAIModel from '@/types/IAIModel';
import ICommitInfo from '@/types/ICommitInfo';
import ICommitValidator, { IValidateResult } from '@/types/ICommitValidator';

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
