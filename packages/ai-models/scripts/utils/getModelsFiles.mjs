import fs from 'node:fs';
import {
  constantsPath,
  excludeModelsFiles,
  modelsDir,
} from '../config/constants.mjs';

export const getModelsFiles = () => {
  if (!fs.existsSync(modelsDir)) {
    console.error(
      '❌ AI Models Dir not found. You may have refactored and forgot to update the generation scripts.',
    );
    console.error(`❌ Please update relativeModelsDir in ${constantsPath}`);
    process.exit(1);
  }

  return fs
    .readdirSync(modelsDir)
    .filter(
      (file) => file.endsWith('Model.ts') && !excludeModelsFiles.includes(file),
    );
};
