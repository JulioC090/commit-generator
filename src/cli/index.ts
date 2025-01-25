#!/usr/bin/env node

import CommandLineInteractor from '@/cli/user-interactor/CommandLineInteractor';
import { createKeyValueArray } from '@/cli/utils/createKeyValueArray';
import configManager from '@/config';
import AddHistory from '@/core/actions/AddHistory';
import CommitGenerated from '@/core/actions/CommitGenerated';
import GenerateAndCommit from '@/core/actions/GenerateAndCommit';
import GenerateCommit from '@/core/actions/GenerateCommit';
import GetHistory from '@/core/actions/GetHistory';
import SaveKey from '@/core/actions/SaveKeys';
import UnsetKeys from '@/core/actions/UnsetKeys';
import OpenAICommitGenerator from '@/core/commit-generator/OpenAICommitGenerator';
import Git from '@/core/utils/Git';
import { program } from 'commander';
import path from 'node:path';

// tsc-alias don't support json files
// eslint-disable-next-line @typescript-eslint/no-require-imports
const packageJSON = require('../../package.json');

program.version(packageJSON.version);

program
  .description('Generate a commit message based on Git diffs and Commit')
  .option(
    '-t, --type <commitType>',
    'Specify the type of commit (e.g., feat, fix, chore, docs, refactor, test, style, build, ci, perf, revert)',
  )
  .option('-f, --force', 'Make commit automatically')
  .action(async (options) => {
    const config = await configManager.loadConfig();

    const historyPath = path.join(__dirname, '../..', 'history');

    const addHistory = new AddHistory({ historyPath });

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
      addHistory,
    });

    const generateAndCommit = new GenerateAndCommit({ generateCommit, git });

    await generateAndCommit.execute(options);
  });

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

    const historyPath = path.join(__dirname, '../..', 'history');

    const addHistory = new AddHistory({ historyPath });

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
      addHistory,
    });

    await generateCommit.execute(options);
  });

program
  .command('commit')
  .description('Commit the last generated message')
  .action(async () => {
    const historyPath = path.join(__dirname, '../..', 'history');

    const getHistory = new GetHistory({ historyPath });
    const git = new Git();

    const commitGenerated = new CommitGenerated({ getHistory, git });

    await commitGenerated.execute();
  });

program
  .command('save <keyValue...>')
  .description('Save configuration keys with their specified values')
  .action(async (keyValue) => {
    const saveKey = new SaveKey({ configManager });

    const keyValuePairs = createKeyValueArray(keyValue);

    await saveKey.execute(keyValuePairs);
  });

program
  .command('remove <key...>')
  .description('Remove a configuration key')
  .action(async (keys) => {
    const unsetKey = new UnsetKeys({ configManager });
    await unsetKey.execute(keys);
  });

program.parse(process.argv);
