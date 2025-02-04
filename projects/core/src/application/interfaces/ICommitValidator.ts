import ICommitInfo from '@/application/interfaces/ICommitInfo';

export interface IValidateResult {
  isValid: boolean;
  recommendedMessage: string;
  analysis: string;
}

export default interface ICommitValidator {
  validate(
    commitMessage: string,
    commitInfo: ICommitInfo,
  ): Promise<IValidateResult>;
}
