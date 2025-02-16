import aiModels from '@/models';
import { IAIModelParams } from '@/types/IAIModelsParams';

export default function createAIModel(
  provider: string,
  parameters: IAIModelParams,
) {
  const modelClass =
    aiModels[provider.toLowerCase() as keyof typeof aiModels] ?? '';

  if (!modelClass) {
    throw new Error(`Unsupported AI model provider: ${provider}`);
  }

  return new modelClass(parameters);
}
