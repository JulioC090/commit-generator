import IAIModel, { IAIModelParams } from '@/application/interfaces/IAIModel';
import OpenAIModel from '@/infrastructure/ai/OpenAIModel';

export default function createAIModel(
  provider: string,
  parameters: IAIModelParams,
): IAIModel {
  switch (provider.toLowerCase()) {
    case 'openai':
      return new OpenAIModel(parameters);
    default:
      throw new Error(`Unsupported AI model provider: ${provider}`);
  }
}
