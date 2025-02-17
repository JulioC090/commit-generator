# @commit-generator/commit-history

This package provides a utility for **managing commit message history** in the **Commit Generator** project. It allows storing and retrieving generated commit messages.

## Installation
To use the commit history utility in your project, install the package:

```bash
pnpm install @commit-generator/commit-history
```

## Usage
After installation, you can use the commit history utility in your project.

1. Adding a Commit to History.  
To store a generated commit message, use the `add` method:

```javascript
import { CommitHistory } from '@commit-generator/commit-history';

const history = new CommitHistory("./commit-history.log");

await history.add("feat: add new feature");
```

2. Retrieving Commit History.  
To retrieve the last *N* commit messages, use the `get` method:

```javascript
const lastCommits = await history.get(5);
console.log(lastCommits);
```

## License
This package is licensed under the MIT License.