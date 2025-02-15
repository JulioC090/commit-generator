import fs from 'node:fs';
import path from 'node:path';
import { constantsPath, schemeOutput } from '../config/constants.mjs';

export const getSchemeOutput = () => {
  if (!fs.existsSync(path.dirname(schemeOutput))) {
    console.error(
      '❌ Scheme output directory not found. You may have refactored and forgot to update the generation scripts.',
    );
    console.error(`❌ Please update schemeOutput in ${constantsPath}`);
    process.exit(1);
  }

  return schemeOutput;
};
