export type IAIModelParams = { [key: string]: unknown };

export default interface IAIModel {
  complete(prompt: string): Promise<string>;
}
