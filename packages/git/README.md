# @commit-generator/git

This package provides Git integration utilities for the **Commit Generator project**. It enables checking repository status, managing commits, viewing logs, and handling diffs.

## Installation

To use this package in your project, install it as a dependency:

```bash
pnpm install @commit-generator/git
```

## Usage

1. Checking if the current directory is a Git repository

```javascript
import { git } from '@commit-generator/git';

if (git.isRepository()) {
  console.log('This is a Git repository');
} else {
  console.log('Not a Git repository');
}
```

2. Viewing unstaged/staged changes with `diff`

```javascript
const diffOutput = git.diff({ staged: false });
console.log(diffOutput);
```

3. Committing changes

```javascript
git.commit('Initial commit');
```

4. Amending the last commit

```javascript
git.amend('Updated commit message');
```

5. Viewing commit logs

```javascript
const logs = git.log(5);
console.log(logs);
```

6. Adding all changes to staging

```javascript
git.add();
```

## License

This package is licensed under the MIT License.