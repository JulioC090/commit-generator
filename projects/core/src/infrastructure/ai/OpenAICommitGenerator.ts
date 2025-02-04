import ICommitGenerator from '@/application/interfaces/ICommitGenerator';
import ICommitInfo from '@/application/interfaces/ICommitInfo';
import { generatePrompt } from '@/infrastructure/ai/prompts/generatePrompt';
import sanitize from '@/infrastructure/ai/sanitizers/sanitize';
import OpenAI from 'openai';

export default class OpenAICommitGenerator implements ICommitGenerator {
  private openai;

  constructor(apiKey: string) {
    this.openai = new OpenAI({
      apiKey: apiKey,
    });
  }

  async generate(commitInfo: ICommitInfo): Promise<string> {
    const completion = await this.openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'user',
          content: generatePrompt(commitInfo),
        },
      ],
    });

    return sanitize(completion.choices[0].message.content || '');
  }
}
