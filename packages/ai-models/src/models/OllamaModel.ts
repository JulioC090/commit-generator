import AIModel from '@/AIModel';
import { IAIModelParams } from '@/types/IAIModelsParams';
import ollama from 'ollama';

export type IOllamaParams = {
  model: string;
};

export const OllamaSchema = {
  type: 'object',
  properties: {
    model: { type: 'string' },
  },
  required: ['model'],
  additionalProperties: false,
};

export default class OllamaModel extends AIModel<IOllamaParams> {
  constructor(parameters: IAIModelParams) {
    super(parameters, OllamaSchema);
  }

  public async complete(prompt: string): Promise<string> {
    const completion = await ollama.chat({
      model: this.parameters.model,
      messages: [{ role: 'user', content: prompt }],
    });

    return completion.message.content;
  }
}
