#!/usr/bin/env node

import generateCommit from '@/actions/generateCommit';
import saveKey from '@/actions/saveKey';
import unsetKey from '@/actions/unsetKey';
import { program } from 'commander';
import packageJSON from '../package.json';

program.version(packageJSON.version);

program
  .command('generate')
  .description('Generate a commit message based on Git diffs')
  .option(
    '-t, --type <commitType>',
    'Specify the type of commit (e.g., feat, fix, chore, docs, refactor, test, style, build, ci, perf, revert)',
  )
  .option('-f, --force', 'Make commit automatically')
  .action(generateCommit);

program
  .command('save <key> <value>')
  .description('Save a configuration key with the specified value')
  .action(saveKey);

program
  .command('remove <key>')
  .description('Remove a configuration key')
  .action(unsetKey);

program.parse(process.argv);
