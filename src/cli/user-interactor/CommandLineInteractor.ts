import IUserInteractor from '@/core/user-interactor/IUserInteractor';
import readline from 'node:readline/promises';

export default class CommandLineInteractor implements IUserInteractor {
  public async confirmCommitMessage(commitMessage: string) {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    const rlPromise = rl.question('Confirm Commit Message: ');
    rl.write(commitMessage);

    const finalCommit = await rlPromise;
    rl.close();

    return finalCommit;
  }
}
