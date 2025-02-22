import AIModel from '@/AIModel';
import { IAIModelParams } from '@/types/IAIModelsParams';
import OpenAI from 'openai';

export type IOpenAIParams = {
  key: string;
  model?: string;
};

export const OpenAISchema = {
  type: 'object',
  properties: {
    key: { type: 'string' },
    model: { type: 'string' },
  },
  required: ['key'],
  additionalProperties: false,
};

export default class OpenAIModel extends AIModel<IOpenAIParams> {
  private model: OpenAI;

  constructor(private params: IAIModelParams) {
    super(params, OpenAISchema);
    this.model = new OpenAI({ apiKey: this.parameters.key });
  }

  async complete(prompt: string): Promise<string> {
    const completion = await this.model.chat.completions.create({
      model: this.parameters.model ?? 'gpt-4o-mini',
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
