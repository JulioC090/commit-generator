export type IAIModelParams = { [key: string]: string };

export default interface IAIModel {
  complete(prompt: string): Promise<string>;
}
