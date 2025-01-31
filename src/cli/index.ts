#!/usr/bin/env node --no-deprecation

import amend from '@/cli/commands/amend';
import commit from '@/cli/commands/commit';
import edit from '@/cli/commands/edit';
import generate from '@/cli/commands/generate';
import generateAndCommit from '@/cli/commands/generateAndCommit';
import remove from '@/cli/commands/remove';
import save from '@/cli/commands/save';
import validate from '@/cli/commands/validate';
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
  .command('edit')
  .description('Edit the last generated commit message')
  .action(edit);

program
  .command('commit')
  .description('Commit the last generated message')
  .action(commit);

program
  .command('amend')
  .description(
    'Amend the last commit by replacing its message with the latest generated one, without modifying the staged files.',
  )
  .action(amend);

program
  .command('validate')
  .argument(
    '[message]',
    'Optional commit message. If not provided, the latest commit will be used.',
  )
  .description(
    'Validate the commit message. If no message is provided, the latest commit will be validated.\n' +
      'This command ensures the message follows best practices and can provide recommendations.',
  )
  .action(validate);

program
  .command('save <keyValue...>')
  .description('Save configuration keys with their specified values')
  .action(save);

program
  .command('remove <key...>')
  .description('Remove a configuration key')
  .action(remove);

program.parse(process.argv);
