import ICommitInfo from '@/application/interfaces/ICommitInfo';
import ICommitValidator, {
  IValidateResult,
} from '@/application/interfaces/ICommitValidator';
import validatePrompt from '@/infrastructure/ai/prompts/validatePrompt';
import normalizeJson from '@/infrastructure/ai/sanitizers/normalizeJson';
import sanitize from '@/infrastructure/ai/sanitizers/sanitize';
import OpenAI from 'openai';

export default class OpenAICommitValidator implements ICommitValidator {
  private openai;

  constructor(apiKey: string) {
    this.openai = new OpenAI({
      apiKey: apiKey,
    });
  }

  public async validate(
    commitMessage: string,
    commitInfo: ICommitInfo,
  ): Promise<IValidateResult> {
    const completion = await this.openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'user',
          content: validatePrompt(commitMessage, commitInfo),
        },
      ],
    });

    const responseText = sanitize(completion.choices[0].message.content || '');
    const normalizedResponse = normalizeJson(responseText);

    try {
      const result = JSON.parse(normalizedResponse) as IValidateResult;
      return result;
    } catch {
      throw new Error(`Invalid OpenAI response: ${responseText}`);
    }
  }
}
