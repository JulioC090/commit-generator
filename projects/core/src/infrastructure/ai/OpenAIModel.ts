import IAIModel, { IAIModelParams } from '@/application/interfaces/IAIModel';
import OpenAI from 'openai';

export default class OpenAIModel implements IAIModel {
  private model: OpenAI;

  constructor(private params: IAIModelParams) {
    if (!params.key) {
      throw new Error('OpenAI API key is required');
    }

    this.model = new OpenAI({ apiKey: params.key });
  }

  async complete(prompt: string): Promise<string> {
    const completion = await this.model.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    return completion.choices[0].message.content || '';
  }
}
