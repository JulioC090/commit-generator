#!/usr/bin/env node

import GenerateCommit from '@/actions/GenerateCommit';
import SaveKey from '@/actions/SaveKey';
import UnsetKey from '@/actions/UnsetKey';
import OpenAICommitGenerator from '@/commit-generator/OpenAICommitGenerator';
import configManager from '@/config';
import CommandLineInteractor from '@/user-interactor/CommandLineInteractor';
import Git from '@/utils/Git';
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
    const git = new Git();
    const generateCommit = new GenerateCommit({
      userInteractor,
      commitGenerator,
      git,
      excludeFiles: config.excludeFiles as Array<string>,
    });

    generateCommit.execute(options);
  });

program
  .command('save <key> <value>')
  .description('Save a configuration key with the specified value')
  .action(async (key, value) => {
    const saveKey = new SaveKey({ configManager });
    await saveKey.execute(key, value);
  });

program
  .command('remove <key>')
  .description('Remove a configuration key')
  .action(async (key) => {
    const unsetKey = new UnsetKey({ configManager });
    await unsetKey.execute(key);
  });

program.parse(process.argv);
