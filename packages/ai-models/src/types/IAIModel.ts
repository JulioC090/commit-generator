export default interface IAIModel {
  complete(prompt: string): Promise<string>;
}
