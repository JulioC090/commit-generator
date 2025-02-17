# @commit-generator/ai-models

This package provides AI models and schemas for the **Commit Generator** project. Currently, it supports models from **OpenAI** and **Ollama**.

## Installation
To use the AI models and schemas in your project, install the package:

```bash
pnpm install @commit-generator/ai-models
```

## Usage
After installation, you can use the AI models and schemas in your project.

1. Using AI Models
The available models are OpenAI and Ollama.
To create an AI model, use the createAIModel function, specifying the provider and parameters:

```javascript
import { createAIModel } from '@commit-generator/ai-models';

const provider = "openai";  // Available models: "openai" or "ollama"

const params = {
  key: "some_key",
};

const model = createAIModel(provider, params);

const result = await model.complete("Hello");
console.log(result);
```

2. Extending Schemas

```javascript
import { aiModelSchemes, IAIModelSchemes } from '@commit-generator/ai-models/schemes';

console.log(aiModelSchemes.openai);

export type IType = {
  myProperties: Array<string>
} & Partial<IAIModelSchemes>;
```

## License
This package is licensed under the MIT License.