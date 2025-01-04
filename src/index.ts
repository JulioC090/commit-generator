#!/usr/bin/env node

import OpenAICommitGenerator from '@/commit-generator/OpenAICommitGenerator';
import configManager from '@/config';
import { exitWithError } from '@/utils/errorHandler';
import { getDiff, isRepository, makeCommit } from '@/utils/git';
import { program } from 'commander';
import packageJSON from '../package.json';

program.version(packageJSON.version);

program
  .command('generate')
  .description('Generate a commit message based on Git diffs')
  .option('-s, --staged', 'Use only staged files for the diff')
  .option(
    '-t, --type <commitType>',
    'Specify the type of commit (e.g., feat, fix, chore, docs, refactor, test, style, build, ci, perf, revert)',
  )
  .option('-f, --force', 'Make commit automatically')
  .action(async (options) => {
    if (!isRepository()) {
      exitWithError(
        'Error: The current directory is not a valid Git repository.',
      );
    }

    const config = await configManager.loadConfig();

    const diff = getDiff({
      staged: options.staged,
      excludeFiles: config.excludeFiles,
    });

    if (!diff) {
      exitWithError('Error: No staged files found.');
    }

    const commitGenerator = new OpenAICommitGenerator(config.openaiKey!);
    const commitMessage = await commitGenerator.generate({
      diff,
      type: options.type,
    });

    makeCommit(commitMessage, { force: options.force });
  });

program
  .command('save <key> <value>')
  .description('Save a configuration key with the specified value')
  .action(async (key, value) => {
    await configManager.saveConfig(key, value, 'local');
  });

program
  .command('remove <key>')
  .description('Remove a configuration key')
  .action(async (key) => {
    await configManager.removeConfig(key, 'local');
  });

program.parse(process.argv);
