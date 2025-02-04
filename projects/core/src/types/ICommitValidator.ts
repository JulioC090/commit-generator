import ICommitInfo from '@/types/ICommitInfo';

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
