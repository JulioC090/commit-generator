import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const constantsPath = fileURLToPath(import.meta.url);

export const __dirname = path.resolve(path.dirname(constantsPath), '../..');

export const excludeModelsFiles = [];

export const relativeModelsDir = 'src/models';
export const relativeSchemeOutput = 'src/schemes.ts';
export const relativeAIModelsOutput = 'src/models/index.ts';

export const modelsDir = path.resolve(__dirname, relativeModelsDir);
export const schemeOutput = path.resolve(__dirname, relativeSchemeOutput);
export const aiModelsOutput = path.resolve(__dirname, relativeAIModelsOutput);
