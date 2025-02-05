import IAIModel from '@/application/interfaces/IAIModel';
import OpenAI from 'openai';

export default class OpenAIModel implements IAIModel {
  private model: OpenAI;

  constructor(private apiKey: string) {
    this.model = new OpenAI({ apiKey: apiKey });
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
