#!/usr/bin/env node --no-deprecation

import amend from '@/commands/amend';
import commit from '@/commands/commit';
import list from '@/commands/config/list';
import set from '@/commands/config/set';
import unset from '@/commands/config/unset';
import edit from '@/commands/edit';
import generate from '@/commands/generate';
import generateAndCommit from '@/commands/generateAndCommit';
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

const configCommand = program
  .command('config')
  .description('Manage configuration');

configCommand
  .command('set')
  .argument('<keyValue...>', 'Key-value pairs (key=value)', keyValueParser)
  .description('Set configuration keys with values')
  .action(set);

configCommand
  .command('unset <key...>')
  .description('Remove configuration keys')
  .action(unset);

configCommand
  .command('list')
  .description(
    'Display the active provider configuration with its parameters and additional settings',
  )
  .action(list);

program.parse(process.argv);
