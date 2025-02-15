import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const constantsPath = fileURLToPath(import.meta.url);

export const __dirname = path.resolve(path.dirname(constantsPath), '../..');

export const excludeModelsFiles = ['AIModel.ts']; // AiModel is a abstract class

export const modelsDir = path.resolve(__dirname, 'src/infrastructure/ai');

export const schemeOutput = path.resolve(__dirname, 'src/schemes.ts');

export const aiModelsOutput = path.resolve(
  __dirname,
  'src/application/factories/ai/aiModels.ts',
);
