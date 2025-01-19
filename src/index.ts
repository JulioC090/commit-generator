#!/usr/bin/env node

import GenerateCommit from '@/actions/GenerateCommit';
import saveKey from '@/actions/saveKey';
import unsetKey from '@/actions/unsetKey';
import OpenAICommitGenerator from '@/commit-generator/OpenAICommitGenerator';
import configManager from '@/config';
import CommandLineInteractor from '@/user-interactor/CommandLineInteractor';
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
  .action(async (options) => {
    const config = await configManager.loadConfig();

    const commitGenerator = new OpenAICommitGenerator(
      (config.openaiKey as string) ?? '',
    );
    const userInteractor = new CommandLineInteractor();
    const generateCommit = new GenerateCommit({
      userInteractor,
      commitGenerator,
      excludeFiles: config.excludeFiles as Array<string>,
    });

    generateCommit.execute(options);
  });

program
  .command('save <key> <value>')
  .description('Save a configuration key with the specified value')
  .action(saveKey);

program
  .command('remove <key>')
  .description('Remove a configuration key')
  .action(unsetKey);

program.parse(process.argv);
