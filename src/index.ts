import { execSync } from 'node:child_process';
import OpenAI from 'openai';

const diff = execSync('git diff --staged').toString();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_KEY,
});

const completion = openai.chat.completions.create({
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

completion.then((response) => {
  console.log(response.choices[0].message.content);
});
