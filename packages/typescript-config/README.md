# @commit-generator/typescript-config

This package contains the shared TypeScript configuration for the **Commit Generator** project.

## Installation
To use the TypeScript configuration in your project, install the package as a development dependency:

```bash
pnpm install --save-dev @commit-generator/typescript-config
```

## Usage
After installation, add the `tsconfig.json` configuration file from the package to your project.

1. Extend the TypeScript configuration

```json
{
  "extends": "@commit-generator/typescript-config"
}
```

2. Customizing the Configuration

To customize the configuration, create your own tsconfig.json and extend the default settings:

```json
{
  "extends": "@commit-generator/typescript-config",
  "compilerOptions": {
    "strict": true, // Enables strict TypeScript checks
    "noUnusedLocals": true // Excludes unused variables
  }
}
```

## License
This package is licensed under the MIT License.