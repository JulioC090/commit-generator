import { IOpenAIParams, openAISchema } from '@/infrastructure/ai/OpenAIModel';

export type IAIModelSchemes = {
  openai: IOpenAIParams;
};

export const aiModelSchemes = {
  openai: openAISchema,
};
