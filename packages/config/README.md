# @commit-generator/config

This package provides a flexible and extensible configuration management utility for the **Commit Generator project**. It supports multiple configuration sources, including files, environment variables, and command-line arguments.

## Installation

To use the configuration management utility in your project, install the package as a dependency:

```bash
pnpm install @commit-generator/config
```

## Usage

1. Define Configuration Sources  
First, define where the configuration values should be loaded from. The example below sets up three sources:  
- **File** (`.myConfigFile.json`): Stores persistent configurations.
- **Environment variables** (`MY_PREFIX_*`): Loads configurations from environment variables.
- **Command-line arguments** (`--key=value`): Allows overriding configurations via CLI.`

```javascript
import createConfigManager, {
  IConfigDefinitions,
  IConfigSource,
} from '@commit-generator/config';

const sources: Array<IConfigSource> = [
  { name: 'local', type: 'file', path: '.myConfigFile.json' },
  { name: 'env', type: 'env', prefix: 'MY_PREFIX' },
  { name: 'arg', type: 'arg' },
];

export type IConfigType = {
  provider: string;
};

const configDefinitions: IConfigDefinitions<IConfigType> = {
  type: 'object',
  properties: {
    provider: { type: 'string' },
  },
  required: ['provider'],
  additionalProperties: false,
};

const configManager = createConfigManager({
  sources,
  definitions: configDefinitions,
});

export default configManager;
```

2. Load Configuration  
Once the sources are defined, you can load the configuration dynamically:

```javascript
import configManager from 'path/to/myConfigManager';

const config = await configManager.loadConfig();

console.log(config);
```

3. Set a Configuration Value  
You can modify a configuration setting and store it in a specific source (e.g., `local` file):

```javascript
import configManager from 'path/to/myConfigManager';

await configManager.set('provider', 'some_provider', 'local');
```

4. Unset a Configuration Value  
To remove a configuration key from a specific source:

```javascript
import configManager from 'path/to/myConfigManager';

await configManager.unset('provider', 'local');
```

## License
This package is licensed under the MIT License.