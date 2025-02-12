import { IOllamaParams, ollamaSchema } from '@/infrastructure/ai/OllamaModel';
import { IOpenAIParams, openAISchema } from '@/infrastructure/ai/OpenAIModel';

export type IAIModelSchemes = {
  openai: IOpenAIParams;
  ollama: IOllamaParams;
};

export const aiModelSchemes = {
  openai: openAISchema,
  ollama: ollamaSchema,
};
