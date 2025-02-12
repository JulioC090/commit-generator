import IAIModel, { IAIModelParams } from '@/application/interfaces/IAIModel';
import AIModel from '@/infrastructure/ai/AIModel';
import ollama from 'ollama';

export type IOllamaParams = {
  model: string;
};

export const ollamaSchema = {
  type: 'object',
  properties: {
    model: { type: 'string' },
  },
  required: ['model'],
  additionalProperties: false,
};

export default class OllamaModel
  extends AIModel<IOllamaParams>
  implements IAIModel
{
  constructor(parameters: IAIModelParams) {
    super(parameters, ollamaSchema);
  }

  public async complete(prompt: string): Promise<string> {
    const completion = await ollama.chat({
      model: this.parameters.model,
      messages: [{ role: 'user', content: prompt }],
    });

    return completion.message.content;
  }
}
