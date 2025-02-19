import AIModel from '@/AIModel';
import { IAIModelParams } from '@/types/IAIModelsParams';
import { Ollama } from 'ollama';

export type IOllamaParams = {
  model: string;
  temperature?: string;
  url?: string;
};

export const OllamaSchema = {
  type: 'object',
  properties: {
    model: { type: 'string' },
    temperature: { type: 'string' },
    url: { type: 'string' },
  },
  required: ['model'],
  additionalProperties: false,
};

export default class OllamaModel extends AIModel<IOllamaParams> {
  private _model: Ollama;

  constructor(parameters: IAIModelParams) {
    super(parameters, OllamaSchema);
    this._model = new Ollama({
      host: this.parameters.url ?? 'http://127.0.0.1:11434',
    });
  }

  public async complete(prompt: string): Promise<string> {
    const completion = await this._model.chat({
      options: {
        temperature: Number(this.parameters.temperature),
      },
      model: this.parameters.model,
      messages: [{ role: 'user', content: prompt }],
    });

    return completion.message.content;
  }
}
