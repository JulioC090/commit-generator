export type Source = {
  name: string;
  type: 'file' | 'env' | 'arg';
  path?: string;
};
