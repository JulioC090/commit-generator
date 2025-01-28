import IDiffOptions from '@/git/types/IDiffOptions';

export default interface IGit {
  isRepository(): boolean;
  diff(options: IDiffOptions): string;
  commit(message: string): void;
  log(amount: number): string;
}
