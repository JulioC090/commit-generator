import IAIModel from '@/application/interfaces/IAIModel';
import ICommitGenerator from '@/application/interfaces/ICommitGenerator';
import ICommitInfo from '@/application/interfaces/ICommitInfo';
import { generatePrompt } from '@/infrastructure/ai/prompts/generatePrompt';
import sanitize from '@/infrastructure/ai/sanitizers/sanitize';

export default class CommitGenerator implements ICommitGenerator {
  constructor(private aiModel: IAIModel) {}

  async generate(commitInfo: ICommitInfo): Promise<string> {
    const complete = await this.aiModel.complete(generatePrompt(commitInfo));
    return sanitize(complete);
  }
}
