#!/usr/bin/env node --no-deprecation

import amend from '@/commands/amend';
import commit from '@/commands/commit';
import edit from '@/commands/edit';
import generate from '@/commands/generate';
import generateAndCommit from '@/commands/generateAndCommit';
import remove from '@/commands/remove';
import save from '@/commands/save';
import validate from '@/commands/validate';
import keyValueParser from '@/parsers/keyValueParser';
import { program } from '@commander-js/extra-typings';

// tsc-alias don't support json files
// eslint-disable-next-line @typescript-eslint/no-require-imports
const packageJSON = require('../package.json');

program.version(packageJSON.version);

program
  .passThroughOptions()
  .description('Generate a commit message based on Git diffs and Commit')
  .option(
    '-t, --type <commitType>',
    'Specify the type of commit (e.g., feat, fix, chore, docs, refactor, test, style, build, ci, perf, revert)',
  )
  .option(
    '-c, --context <context>',
    'Provide additional context for the commit message (e.g., related issue, scope, or extra details)',
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
  .option(
    '-c, --context <context>',
    'Provide additional context for the commit message (e.g., related issue, scope, or extra details)',
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
  .command('save')
  .argument(
    '<keyValue...>',
    'Key-value pairs in the format key=value',
    keyValueParser,
  )
  .description('Save configuration keys with their specified values')
  .action(save);

program
  .command('remove <key...>')
  .description('Remove a configuration key')
  .action(remove);

program.parse(process.argv);
