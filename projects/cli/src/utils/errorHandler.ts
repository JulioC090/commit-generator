export function exitWithError(message: string) {
  console.error(`Error: ${message}`);
  process.exit(1);
}
