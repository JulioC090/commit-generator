import fs from 'fs';
import { getAIModelsOutput } from './utils/getAIModelsOutput.mjs';
import { getModelsFiles } from './utils/getModelsFiles.mjs';

console.log('📝 Generating AI Models...');

const files = getModelsFiles();

const imports = files
  .map((file) => {
    const modelName = file.replace('.ts', '');
    return `import ${modelName} from '@/infrastructure/ai/${modelName}';`;
  })
  .join('\n');

const modelsObject = files
  .map((file) => {
    const modelName = file.replace('.ts', '');
    return `${modelName.replace('Model', '').toLowerCase()}: ${modelName},`;
  })
  .join('\n  ');

const content = `// AUTO-GENERATED FILE. DO NOT EDIT MANUALLY.
${imports}

const aiModels = {
  ${modelsObject}
};

export default aiModels;
`;

fs.writeFileSync(getAIModelsOutput(), content, 'utf8');

console.log('✅ AI Models generated successfully!');
