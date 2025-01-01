import OpenAICommitGenerator from '@/commit-generator/OpenAICommitGenerator';
import { exitWithError } from '@/utils/errorHandler';
import { getDiff, isRepository } from '@/utils/git';
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
  .action(async (options) => {
    if (!isRepository()) {
      exitWithError(
        'Error: The current directory is not a valid Git repository.',
      );
    }

    const diff = getDiff({
      staged: options.staged,
      excludeFiles: ['pnpm-lock.yaml', 'package-lock.json'],
    });

    if (!diff) {
      exitWithError('Error: No staged files found.');
    }

    const commitGenerator = new OpenAICommitGenerator(process.env.OPENAI_KEY!);
    const commitMessage = await commitGenerator.generate({
      diff,
      type: options.type,
    });
    console.log(commitMessage);
  });

program.parse(process.argv);
