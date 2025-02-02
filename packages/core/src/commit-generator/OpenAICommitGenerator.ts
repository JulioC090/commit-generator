import { generatePrompt } from '@/commit-generator/generatePrompt';
import ICommitGenerator from '@/types/ICommitGenerator';
import ICommitInfo from '@/types/ICommitInfo';
import sanitize from '@/utils/sanitize';
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
