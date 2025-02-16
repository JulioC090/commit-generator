# @commit-generator/eslint-config

This package contains a shared **ESLint** configuration for the **Commit Generator** project.

## Installation
To use the ESLint configuration in your project, install the package as a development dependency:

```bash
pnpm install --save-dev @commit-generator/eslint-config
```

## Usage
After installation, extend the ESLint configuration in your project.

1. Create or update your `eslint.config.mjs` file with the following configuration:

```javascript
import eslintNode from '@commit-generator/eslint-config/node.js';

export default [...eslintNode];
```

2. Customizing the Configuration
If you'd like to customize the configuration, create your own `eslint.config.mjs` and extend the default settings:

```javascript
import eslintNode from '@commit-generator/eslint-config/node.js';

export default [
  ...eslintNode,
  myConfigs
];
```

## License
This package is licensed under the MIT License.