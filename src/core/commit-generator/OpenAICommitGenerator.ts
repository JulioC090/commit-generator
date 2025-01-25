import CommitInfo from '@/core/commit-generator/CommitInfo';
import ICommitGenerator from '@/core/commit-generator/ICommitGenerator';
import { buildPrompt } from '@/core/commit-generator/prompt';
import OpenAI from 'openai';

export default class OpenAICommitGenerator implements ICommitGenerator {
  private openai;

  constructor(apiKey: string) {
    this.openai = new OpenAI({
      apiKey: apiKey,
    });
  }

  async generate(commitInfo: CommitInfo): Promise<string> {
    const completion = await this.openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'user',
          content: buildPrompt(commitInfo),
        },
      ],
    });

    return completion.choices[0].message.content || '';
  }
}
