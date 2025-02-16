import { generatePrompt } from '@/prompts/generatePrompt';
import sanitize from '@/sanitizers/sanitize';
import IAIModel from '@/types/IAIModel';
import ICommitGenerator from '@/types/ICommitGenerator';
import ICommitInfo from '@/types/ICommitInfo';

export default class CommitGenerator implements ICommitGenerator {
  constructor(private aiModel: IAIModel) {}

  async generate(commitInfo: ICommitInfo): Promise<string> {
    const complete = await this.aiModel.complete(generatePrompt(commitInfo));
    return sanitize(complete);
  }
}
