#!/usr/bin/env node

import commit from '@/cli/commands/commit';
import generate from '@/cli/commands/generate';
import generateAndCommit from '@/cli/commands/generateAndCommit';
import remove from '@/cli/commands/remove';
import save from '@/cli/commands/save';
import { program } from 'commander';

// tsc-alias don't support json files
// eslint-disable-next-line @typescript-eslint/no-require-imports
const packageJSON = require('../../package.json');

program.version(packageJSON.version);

program
  .passThroughOptions()
  .description('Generate a commit message based on Git diffs and Commit')
  .option(
    '-t, --type <commitType>',
    'Specify the type of commit (e.g., feat, fix, chore, docs, refactor, test, style, build, ci, perf, revert)',
  )
  .option('-f, --force', 'Make commit automatically')
  .action(generateAndCommit);

program
  .command('generate')
  .description('Generate a commit message based on Git diffs')
  .option(
    '-t, --type <commitType>',
    'Specify the type of commit (e.g., feat, fix, chore, docs, refactor, test, style, build, ci, perf, revert)',
  )
  .action(generate);

program
  .command('commit')
  .description('Commit the last generated message')
  .action(commit);

program
  .command('save <keyValue...>')
  .description('Save configuration keys with their specified values')
  .action(save);

program
  .command('remove <key...>')
  .description('Remove a configuration key')
  .action(remove);

program.parse(process.argv);
