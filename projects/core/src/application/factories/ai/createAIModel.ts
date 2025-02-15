import aiModels from '@/application/factories/ai/aiModels';
import IAIModel, { IAIModelParams } from '@/application/interfaces/IAIModel';

export default function createAIModel(
  provider: string,
  parameters: IAIModelParams,
): IAIModel {
  const modelClass =
    aiModels[provider.toLowerCase() as keyof typeof aiModels] ?? '';

  if (!modelClass) {
    throw new Error(`Unsupported AI model provider: ${provider}`);
  }

  return new modelClass(parameters);
}
