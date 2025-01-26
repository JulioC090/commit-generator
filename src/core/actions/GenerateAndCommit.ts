import GenerateCommit from '@/core/actions/GenerateCommit';
import IGit from '@/git/types/IGit';

interface GenerateAndCommitProps {
  generateCommit: GenerateCommit;
  git: IGit;
}

interface ExecuteOptions {
  force?: boolean;
  type?: string;
}

export default class GenerateAndCommit {
  private generateCommit: GenerateCommit;
  private git: IGit;

  constructor({ generateCommit, git }: GenerateAndCommitProps) {
    this.generateCommit = generateCommit;
    this.git = git;
  }

  async execute(options: ExecuteOptions): Promise<void> {
    const commitMessage = await this.generateCommit.execute(options);
    this.git.commit(commitMessage);
  }
}
