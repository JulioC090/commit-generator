import fs from 'fs';
import { getModelsFiles } from './utils/getModelsFiles.mjs';
import { getSchemeOutput } from './utils/getSchemeOutput.mjs';

console.log('📝 Generating schemes...');

const files = getModelsFiles();

const imports = files
  .map((file) => {
    const modelName = file.replace('Model.ts', '');
    return `import { ${modelName}Schema, I${modelName}Params } from './infrastructure/ai/${file.replace('.ts', '')}';`;
  })
  .join('\n');

const registry = `export const aiModelSchemes = {\n  ${files
  .map((file) => {
    const modelName = file.replace('Model.ts', '');
    return `${modelName.toLowerCase()}: ${modelName}Schema,`;
  })
  .join('\n  ')}\n};\n`;

const types = `export type IAIModelSchemes = {\n  ${files
  .map((file) => {
    const modelName = file.replace('Model.ts', '');
    return `${modelName.toLowerCase()}: I${modelName}Params;`;
  })
  .join('\n  ')}\n};\n`;

const content = `// AUTO-GENERATED FILE. DO NOT EDIT MANUALLY.
${imports}

${types}
${registry}`;

fs.writeFileSync(getSchemeOutput(), content);

console.log('✅ Schemes generated successfully!');
