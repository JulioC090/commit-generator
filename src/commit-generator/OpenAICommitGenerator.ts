import OpenAI from 'openai';

export default class OpenAICommitGenerator {
  private openai;

  constructor(apiKey: string) {
    this.openai = new OpenAI({
      apiKey: apiKey,
    });
  }

  async generate(diff: string): Promise<string> {
    const completion = await this.openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'user',
          content: `
          Create a commit message in the Conventional Commits format for this diff:
    
          ${diff}
    
          As a response, just give the message:
          <type>: <description>`,
        },
      ],
    });

    return completion.choices[0].message.content || '';
  }
}
