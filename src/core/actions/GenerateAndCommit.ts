import GenerateCommit from '@/core/actions/GenerateCommit';
import Git from '@/core/utils/Git';

interface GenerateAndCommitProps {
  generateCommit: GenerateCommit;
  git: Git;
}

interface ExecuteOptions {
  force?: boolean;
  type?: string;
}

export default class GenerateAndCommit {
  private generateCommit: GenerateCommit;
  private git: Git;

  constructor({ generateCommit, git }: GenerateAndCommitProps) {
    this.generateCommit = generateCommit;
    this.git = git;
  }

  async execute(options: ExecuteOptions): Promise<void> {
    const commitMessage = await this.generateCommit.execute(options);
    this.git.commit(commitMessage);
  }
}
