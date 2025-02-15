import fs from 'node:fs';
import path from 'node:path';
import { aiModelsOutput, constantsPath } from '../config/constants.mjs';

export const getAIModelsOutput = () => {
  if (!fs.existsSync(path.dirname(aiModelsOutput))) {
    console.error(
      '❌ AI Models output directory not found. You may have refactored and forgot to update the generation scripts.',
    );
    console.error(`❌ Please update aiModelsOutput in ${constantsPath}`);
    process.exit(1);
  }

  return aiModelsOutput;
};
