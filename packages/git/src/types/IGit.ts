import IDiffOptions from '@/types/IDiffOptions';

export default interface IGit {
  isRepository(): boolean;
  diff(options: IDiffOptions): string;
  commit(message: string): void;
  amend(message: string): void;
  log(amount: number): string;
}
