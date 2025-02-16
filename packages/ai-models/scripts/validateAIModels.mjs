import path from 'path';
import { Project } from 'ts-morph';
import { __dirname, modelsDir } from './config/constants.mjs';
import { getModelsFiles } from './utils/getModelsFiles.mjs';

console.log('🔍 Starting AI model validation...');

const files = getModelsFiles();

const project = new Project({
  tsConfigFilePath: path.resolve(__dirname, 'tsconfig.json'),
});

const invalidModels = new Set();

files.forEach((file) => {
  const filePath = path.join(modelsDir, file);
  const sourceFile = project.addSourceFileAtPath(filePath);

  const modelName = file.replace('Model.ts', '');
  const expectedSchema = `${modelName}Schema`;
  const expectedParams = `I${modelName}Params`;

  const exportedSchemas = sourceFile.getExportedDeclarations();
  const hasSchema = exportedSchemas.has(expectedSchema);
  const hasParams = exportedSchemas.has(expectedParams);

  if (!hasSchema) {
    console.error(
      `❌ ${path.resolve(modelsDir, file)} should export ${expectedSchema}`,
    );
    invalidModels.add(file);
  }

  if (!hasParams) {
    console.error(
      `❌ ${path.resolve(modelsDir, file)}should export ${expectedParams}`,
    );
    invalidModels.add(file);
  }
});

if (invalidModels.size > 0) {
  console.error(
    '🚨 The following models need maintenance. Process interrupted:',
  );
  invalidModels.forEach((model) => console.error(`   - ${model}`));
  process.exit(1);
}

console.log('✅ AI model validation completed successfully!');
