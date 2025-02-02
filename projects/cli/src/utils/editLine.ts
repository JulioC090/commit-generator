import readline from 'node:readline/promises';

export default async function editLine(line: string): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const rlPromise = rl.question('Edit: \n');
  rl.write(line);

  const result = await rlPromise;
  rl.close();

  return result;
}
