import IAIModel, { IAIModelParams } from '@/application/interfaces/IAIModel';
import AIModel from '@/infrastructure/ai/AIModel';
import OpenAI from 'openai';

export type IOpenAIParams = {
  key: string;
};

export const openAISchema = {
  type: 'object',
  properties: {
    key: { type: 'string' },
  },
  required: ['key'],
  additionalProperties: false,
};

export default class OpenAIModel extends AIModel implements IAIModel {
  private model: OpenAI;

  constructor(private params: IAIModelParams) {
    super(params, openAISchema);
    const openAIParams = params as IOpenAIParams;
    this.model = new OpenAI({ apiKey: openAIParams.key });
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
