# @commit-generator/core

This package provides the core functionalities for the Commit Generator project. It includes essential commit operations and AI model schemes.

## Installation

To use this package in your project, install it as a dependency:

```bash
pnpm install @commit-generator/core
```

## Usage

1. Using Factories  
Actions are generated using factories. Here’s an example:

```javascript
import { createGenerateCommit } from '@commit-generator/core';

async function generate() {
  const generateCommitConfig = {
    provider: 'openai',
    params: { key: 'some_key' },
  };

  const generateCommit = createGenerateCommit(
    generateCommitConfig, 
    'path/to/history', 
    ['pnpm-lock.yaml']
  );

  console.log(
    await generateCommit.execute({
      type: 'feat',
      context: 'This is a test commit',
    })
  );
}

generate();
```

2. AI Model Schemes  
For convenience, this module exports AI schemes from [AI Models](../../packages/ai-models/).

```javascript
import { aiModelSchemes } from '@commit-generator/core/schemes';

console.log(aiModelSchemes);
```

## License
This package is licensed under the MIT License.